import smtplib
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from django.http import JsonResponse
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .models import Invitation
from .serializers import InvitationSerializer
from calendars.models import Calendars, UserCalendars
from calendars.serializers import NonBusyDateSerializer
from contacts.models import Contact


# Create your views here.
class InviteToCalendarSendEmailView(APIView):
    permission_classes = [IsAuthenticated]

    @staticmethod
    def post(request, *args, **kwargs):
        primary_user = request.user
        calendar_id = request.data.get('calendar_id')
        contact_id = request.data.get('contact_id')

        print(f'calendar_id: {calendar_id}, contact_id: {contact_id}')

        invited_contact = get_object_or_404(Contact, id=contact_id)
        print(f'invited_contact: {invited_contact}')

        calendar = get_object_or_404(Calendars, id=calendar_id)
        print(f'calendar: {calendar}')

        if invited_contact.user != primary_user:
            print('invited_contact is not a contact of primary_user')
            return JsonResponse({'detail': 'You can only invite your contacts to a calendar'})

        existing_invitation = Invitation.objects.filter(calendar=calendar, invited_contact=invited_contact).first()

        if existing_invitation:
            print('Invitation already exists')
            serializer = InvitationSerializer(existing_invitation)
            return JsonResponse({'detail': f'Invitation already sent to {invited_contact.email} for this calendar',
                                 'invitation': serializer.data})

        serializer = InvitationSerializer(data={'calendar': calendar_id, 'invited_contact': contact_id})
        if serializer.is_valid():
            serializer.save()
            try:
                send_email(serializer.instance, primary_user, 'invitation')
            except smtplib.SMTPException as e:
                return JsonResponse({'detail': f'Error sending email: {str(e)}'}, status=500)

            return JsonResponse(
                {'detail': f'Invitation email sent successfully to {invited_contact.email}',
                 'invitation': serializer.data})
        else:
            print(f'Invalid data for creating an invitation: {serializer.errors}')
            return JsonResponse({'detail': 'Invalid data for creating an invitation'}, status=400)


class ReminderView(APIView):
    permission_classes = [IsAuthenticated]

    @staticmethod
    def post(request, *args, **kwargs):
        primary_user = request.user
        calendar_id = request.data.get('calendar_id')
        contact_id = request.data.get('contact_id')

        contact = get_object_or_404(Contact, id=contact_id)
        invitation = get_object_or_404(Invitation, calendar_id=calendar_id, invited_contact=contact)
        if invitation:
            serializer = InvitationSerializer(invitation)
            if invitation.status != 'pending':
                return JsonResponse(
                    {'detail': f'Contact {contact.email} has either accepted or declined the invitation',
                     'invitation': serializer.data})
            try:
                send_email(invitation, primary_user, 'reminder')
            except smtplib.SMTPException as e:
                return JsonResponse({'detail': f'Error sending email: {str(e)}'}, status=500)
            return JsonResponse({'detail': f'Reminder email sent successfully to {contact.email}',
                                 'invitation': serializer.data})
        else:
            return JsonResponse({'detail': f'Invitation to contact {contact.email} not found'})


class NotifyFinalizedScheduleView(APIView):
    @staticmethod
    def get(request, *args, **kwargs):
        calendar_id = request.data.get('calendar_id')
        calendar = get_object_or_404(Calendars, calendar=calendar_id)

        if calendar.finalized:
            for invitation in calendar.invitations.all():
                # TODO: send email to all invited users
                # send_email(invitation, , 'confirm')
                pass

            serialized_invitations = InvitationSerializer(calendar.invitations, many=True).data
            return JsonResponse(
                {'message': 'Actions after schedule finalization completed', 'invitations': serialized_invitations})
        else:
            return JsonResponse({'message': 'Schedule is not finalized yet'})


class StatusView(APIView):
    permission_classes = [IsAuthenticated]

    @staticmethod
    def get(request, *args, **kwargs):
        user_calendars = UserCalendars.objects.filter(user=request.user)
        calendar_statuses = []
        for user_calendar in user_calendars:
            calendar_id = user_calendar.calendar.id
            pending_users = Invitation.objects.filter(calendar=user_calendar.calendar, status='pending')
            declined_users = Invitation.objects.filter(calendar=user_calendar.calendar, status='declined')
            accepted_users = Invitation.objects.filter(calendar=user_calendar.calendar, status='accepted')
            pending_usernames = [invitation.invited_contact.username for invitation in pending_users]
            declined_usernames = [invitation.invited_contact.username for invitation in declined_users]
            accepted_usernames = [invitation.invited_contact.username for invitation in accepted_users]
            calendar_status = {
                "calendar_id": calendar_id,
                "pending_usernames": pending_usernames,
                "declined_usernames": declined_usernames,
                "accepted_usernames": accepted_usernames
            }
            calendar_statuses.append(calendar_status)

        return JsonResponse({"calendar_statuses": calendar_statuses})


class InvitedUserLandingView(APIView):
    @staticmethod
    def get(request, unique_link, *args, **kwargs):
        invitation = get_object_or_404(Invitation, unique_token=unique_link)
        calendar = get_object_or_404(UserCalendars, calendar=invitation.calendar)
        owner_preferences = NonBusyDateSerializer(calendar.non_busy_dates.all(), many=True).data

        return JsonResponse({'owner_preferences': owner_preferences})

    @staticmethod
    def post(request, unique_link, *args, **kwargs):
        invitation = get_object_or_404(Invitation, unique_token=unique_link)
        calendar = get_object_or_404(UserCalendars, calendar=invitation.calendar)
        non_busy_dates_data = request.data.get('non_busy_dates', [])

        for non_busy_date_data in non_busy_dates_data:
            non_busy_date_serializer = NonBusyDateSerializer(data=non_busy_date_data)
            non_busy_date_serializer.is_valid(raise_exception=True)
            non_busy_date_serializer.save()
            invitation.invited_contact_non_busy_dates.add(non_busy_date_serializer.instance)

        invitation.status = 'accepted'
        invitation.save()
        serializer = InvitationSerializer(invitation)
        return JsonResponse({'detail': f'{invitation.invited_contact.username} preferences updated for this calendar',
                             'invitation': serializer.data})


class DeclineInvitationView(APIView):
    @staticmethod
    def get(request, unique_link, *args, **kwargs):
        invitation = get_object_or_404(Invitation, unique_token=unique_link)

        if invitation:
            invitation.status = 'declined'
            invitation.save()
            serializer = InvitationSerializer(invitation)
            return JsonResponse({'detail': f'Invitation declined successfully', 'invitation': serializer.data})
        else:
            return JsonResponse({'detail': f'Invitation not found or already declined'}, status=400)


def send_email(invitation, inviter, email_type):
    from_email = inviter.email  # Assuming inviter is still a User model object
    to_email = invitation.invited_contact.email  # Contact's email
    calendar_name = invitation.calendar.name
    subject = message = ''

    unique_link_base = 'http://127.0.0.1:8000/notify/invited_user_landing/'

    if email_type == 'invitation':
        unique_link = f'{unique_link_base}{invitation.unique_token}/'
        subject = f'Invitation to Calendar {calendar_name}'
        message = f'You have been invited to join the calendar "{calendar_name}" by {inviter.username}. Please click the link below to respond:\n\n{unique_link}'

    elif email_type == 'reminder':
        unique_link = f'{unique_link_base}{invitation.unique_token}/'
        subject = f'Reminder: Invitation to Calendar {calendar_name}'
        message = f'This is a reminder that you\'ve been invited to join the calendar "{calendar_name}" by {inviter.username}. Please click the link below to respond:\n\n{unique_link}'

    elif email_type == 'confirm':
        # Assuming we have a finalized link for confirmation
        unique_link = f'{unique_link_base}finalized/{invitation.unique_token}/'
        subject = 'Meeting Finalized'
        message = f'Your meeting "{calendar_name}" has been finalized. Click the link below for more details:\n\n{unique_link}'

    send_mail(
        subject,
        message,
        from_email,
        [to_email],
        fail_silently=False,
    )
