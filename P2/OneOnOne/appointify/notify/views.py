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


# Create your views here.
class InviteToCalendarSendEmailView(APIView):
    permission_classes = [IsAuthenticated]

    @staticmethod
    def post(request, *args, **kwargs):
        primary_user = request.user
        calendar_id = request.data.get('calendar_id')
        contact_id = request.data.get('contact_id')

        # TODO: change User to a contacts table
        invited_user = get_object_or_404(User, id=contact_id)
        calendar = get_object_or_404(Calendars, id=calendar_id)
        existing_invitation = Invitation.objects.filter(calendar=calendar, invited_user=invited_user).first()

        if primary_user == invited_user:
            return JsonResponse({'detail': 'You cannot invite yourself to a calendar'})

        if not existing_invitation:
            serializer = InvitationSerializer(data={'calendar': calendar_id, 'invited_user': contact_id})
            if serializer.is_valid():
                serializer.save()
                try:
                    send_email(serializer.instance, primary_user, 'invitation')
                except smtplib.SMTPException as e:
                    return JsonResponse({'detail': f'Error sending email: {str(e)}'}, status=500)

                return JsonResponse(
                    {'detail': f'Invitation email sent successfully to {invited_user.username}',
                     'invitation': serializer.data})
            else:
                return JsonResponse({'detail': 'Invalid data for creating an invitation'}, status=400)
        else:
            serializer = InvitationSerializer(existing_invitation)
            return JsonResponse({'detail': f'Invitation already sent to {invited_user.username} for this calendar',
                                 'invitation': serializer.data})


class ReminderView(APIView):
    permission_classes = [IsAuthenticated]

    @staticmethod
    def post(request, *args, **kwargs):
        primary_user = request.user
        calendar_id = request.data.get('calendar_id')
        contact_id = request.data.get('contact_id')

        # TODO: change User to a contacts table
        contact = get_object_or_404(User, id=contact_id)
        invitation = get_object_or_404(Invitation, calendar_id=calendar_id, invited_user=contact, status='pending')
        if invitation:
            try:
                send_email(invitation, primary_user, 'reminder')
            except smtplib.SMTPException as e:
                return JsonResponse({'detail': f'Error sending email: {str(e)}'}, status=500)

            serializer = InvitationSerializer(invitation)
            return JsonResponse({'detail': f'Reminder email sent successfully to {contact.username}',
                                 'invitation': serializer.data})
        else:
            return JsonResponse({'detail': f'Contact {contact.username} not found or invitation not pending'})


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
            pending_usernames = [invitation.invited_user.username for invitation in pending_users]
            declined_usernames = [invitation.invited_user.username for invitation in declined_users]
            accepted_usernames = [invitation.invited_user.username for invitation in accepted_users]
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
            invitation.invited_user_non_busy_dates.add(non_busy_date_serializer.instance)

        invitation.status = 'accepted'
        invitation.save()
        serializer = InvitationSerializer(invitation)
        return JsonResponse({'detail': f'{invitation.invited_user.username} preferences updated for this calendar',
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
    from_name = inviter.username
    from_email = inviter.email
    to_email = invitation.invited_user.email
    calendar_name = invitation.calendar.name
    subject = message = ''

    if email_type == 'invitation':
        unique_link = f'http://127.0.0.1:8000/notify/invited_user_landing/{invitation.unique_token}/'
        subject = f'Invitation to Calendar {calendar_name} from {from_name}'
        message = (f'You have been invited to a calendar from {from_name}. '
                   f'Click the link below to view the details:\n\n{unique_link}')

    if email_type == 'reminder':
        unique_link = f'http://127.0.0.1:8000/notify/invited_user_landing/{invitation.unique_token}/'
        subject = f'Reminder to Calendar {calendar_name} from {from_name}'
        message = (f'You have been reminded of a calendar from {from_name}. '
                   f'Click the link below to view the details:\n\n{unique_link}')

    if email_type == 'confirm':
        unique_link = f'http://127.0.0.1:8000/notify/finalized/{invitation.unique_token}/'
        subject = 'Meeting Finalized'
        message = (f'Your meeting with {from_name} has been finalized. '
                   f'Click the link below to view the details:\n\n{unique_link}')

    send_mail(
        subject,
        message,
        from_email,
        [to_email],
        fail_silently=False,
    )
