import smtplib
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .models import Invitation
from .serializers import InvitationSerializer
from calendars.models import Calendars, UserCalendars
from calendars.serializers import NonBusyDateSerializer
from contacts.models import Contact

from events.models import Event
from events.serializers import EventsSerializer
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination


# Create your views here.
class InviteToCalendarSendEmailView(APIView):
    permission_classes = [IsAuthenticated]

    @staticmethod
    def post(request, *args, **kwargs):
        primary_user = request.user
        calendar_id = request.data.get('calendar_id')
        contact_id = request.data.get('contact_id')

        invited_contact = get_object_or_404(Contact, id=contact_id)

        calendar = get_object_or_404(Calendars, id=calendar_id)

        if invited_contact.user != primary_user:
            return JsonResponse({'detail': 'You can only invite your contacts to a calendar'})

        existing_invitation = Invitation.objects.filter(calendar=calendar, invited_contact=invited_contact).first()

        if existing_invitation:
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
            print(serializer.errors)
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
                return JsonResponse({'detail': f'Reminder email sent successfully to {contact.email}',
                                     'invitation': serializer.data})
            except smtplib.SMTPException as e:
                return JsonResponse({'detail': f'Error sending email: {str(e)}'}, status=500)
        else:
            return JsonResponse({'detail': f'Invitation to contact {contact.email} not found'}, status=400)


class NotifyFinalizedScheduleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        calendar_id = request.data.get('calendar_id')
        calendar = get_object_or_404(Calendars, id=calendar_id)
        user_calendar = UserCalendars.objects.filter(user=request.user, calendar=calendar)
        if not user_calendar:
            return Response({'message': 'You do not have access to this calendar'}, status=403)
        if calendar.isfinalized:
            events = Event.objects.filter(calendar=calendar)
            events_serialized = EventsSerializer(events, many=True).data

            for event_data in events_serialized:
                contact_email = event_data['contact_email']
                event_details = '\n'.join([f"{key}: {value}" for key, value in event_data.items()])
                send_mail(
                    'Finalized Event',
                    event_details,
                    request.user.email,
                    [contact_email]
                )

            return Response({'message': 'Notifications sent to all contacts', 'events': events_serialized})
        else:
            return Response({'message': 'Schedule is not finalized yet'}, status=400)


class StatusView(APIView):
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination

    def get(self, request, *args, **kwargs):
        user_calendars = UserCalendars.objects.filter(user=request.user)
        calendar_statuses = []
        calendar_id = request.query_params.get('calendar_id')
        status = request.query_params.get('status')

        for user_calendar in user_calendars:
            if calendar_id and str(user_calendar.calendar.id) != calendar_id:
                continue

            pending_users = Invitation.objects.filter(calendar=user_calendar.calendar, status='pending')
            declined_users = Invitation.objects.filter(calendar=user_calendar.calendar, status='declined')
            accepted_users = Invitation.objects.filter(calendar=user_calendar.calendar, status='accepted')

            if status == 'pending':
                users = pending_users
            elif status == 'declined':
                users = declined_users
            elif status == 'accepted':
                users = accepted_users
            else:
                return JsonResponse({'detail': 'Invalid status'}, status=400)

            usernames = [invitation.invited_contact.fname for invitation in users]

            calendar_status = {
                "calendar_id": user_calendar.calendar.id,
                "status": status or "all",
                "usernames": usernames,
            }
            calendar_statuses.append(calendar_status)

        paginator = self.pagination_class()
        result_page = paginator.paginate_queryset(calendar_statuses, request)
        return paginator.get_paginated_response(result_page)


class InvitedUserLandingView(APIView):
    @staticmethod
    def get(request, unique_link, *args, **kwargs):
        invitation = get_object_or_404(Invitation, unique_token=unique_link)
        calendar = get_object_or_404(UserCalendars, calendar=invitation.calendar)
        owner_preferences = NonBusyDateSerializer(calendar.non_busy_dates.all(), many=True).data
        serializer = InvitationSerializer(invitation)
        return JsonResponse({'owner_preferences': owner_preferences, 'invitation': serializer.data, 'owner_name': calendar.user.first_name + ' ' + calendar.user.last_name, 'calendar_name': invitation.calendar.name, 'calendar_description': invitation.calendar.description})

    @staticmethod
    def post(request, unique_link, *args, **kwargs):
        invitation = get_object_or_404(Invitation, unique_token=unique_link)
        non_busy_dates_data = request.data.get('non_busy_dates', [])
        if invitation.calendar.isfinalized:
            return JsonResponse({'detail': f'Calendar {invitation.calendar.name} is already finalized'}, status=400)
        invitation.invited_contact_non_busy_dates.clear()

        for non_busy_date_data in non_busy_dates_data:
            non_busy_date_serializer = NonBusyDateSerializer(data=non_busy_date_data)
            non_busy_date_serializer.is_valid(raise_exception=True)
            non_busy_date_serializer.save()
            invitation.invited_contact_non_busy_dates.add(non_busy_date_serializer.instance)

        invitation.status = 'accepted'
        invitation.save()
        serializer = InvitationSerializer(invitation)
        return JsonResponse({'detail': f'{invitation.invited_contact.fname} preferences updated for this calendar',
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
    from_email = inviter.email
    to_email = invitation.invited_contact.email
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
