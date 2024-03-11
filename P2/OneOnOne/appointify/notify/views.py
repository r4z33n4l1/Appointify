from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .models import Invitation
from .serializers import InvitationSerializer
from calendars.models import Calendars
from .calendars.serializers import NonBusyTimeSerializer


# Create your views here.
class InviteToCalendarSendEmailView(APIView):
    permission_classes = [IsAuthenticated]

    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    @staticmethod
    def post(request, *args, **kwargs):
        primary_user = request.user
        calendar_id = request.POST.get('calendar_id')
        invited_user_id = request.POST.get('contact_id')
        invited_user = get_object_or_404(User, pk=invited_user_id)
        calendar = get_object_or_404(Calendars, pk=calendar_id)
        existing_invitation = Invitation.objects.filter(calendar=calendar, invited_user=invited_user).first()
        if not existing_invitation:
            invitation = Invitation.objects.create(calendar=calendar, invited_user=invited_user)
            send_email(invitation, primary_user, 'invitation')
            invitation.status = 'pending'
            invitation.save()

            serializer = InvitationSerializer(invitation)
            return JsonResponse(
                {'detail': f'Invitation email sent successfully to {invited_user_id}', 'invitation': serializer.data})
        else:
            serializer = InvitationSerializer(existing_invitation)
            return JsonResponse({'detail': f'Invitation already sent to {invited_user_id} for this calendar',
                                 'invitation': serializer.data})


class ReminderView(APIView):
    permission_classes = [IsAuthenticated]

    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    @staticmethod
    def post(request, *args, **kwargs):
        primary_user = request.user
        calendar_id = kwargs.get('calendar_id')
        contact_id = kwargs.get('contact_id')
        contact = get_object_or_404(Invitation, pk=contact_id)
        invitation = get_object_or_404(Invitation, calendar_id=calendar_id, invited_user=contact.user, status='pending')
        if invitation:
            send_email(invitation, primary_user, 'reminder')

            serializer = InvitationSerializer(invitation)
            return JsonResponse({'detail': f'Reminder email sent successfully for {contact.user.username}',
                                 'invitation': serializer.data})
        else:
            return JsonResponse({'detail': f'Contact {contact.user.username} not found or invitation not pending'})


class NotifyFinalizedScheduleView(APIView):
    def get(self, request, *args, **kwargs):
        calendar_id = self.kwargs['calendar_id']
        calendar = get_object_or_404(Calendars, pk=calendar_id)

        if calendar.finalized:
            for invitation in calendar.invitations.all():
                # TODO
                # send_email(invitation, , 'confirm')
                pass

            serialized_invitations = InvitationSerializer(calendar.invitations, many=True).data
            return JsonResponse(
                {'message': 'Actions after schedule finalization completed', 'invitations': serialized_invitations})
        else:
            return JsonResponse({'message': 'Schedule is not finalized yet'})


class StatusView(APIView):
    permission_classes = [IsAuthenticated]

    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    @staticmethod
    def get(request, *args, **kwargs):
        calendar_id = request.GET.get('calendar_id')
        calendar = get_object_or_404(Calendars, pk=calendar_id)
        pending_users = Invitation.objects.filter(calendar=calendar, status='pending')
        declined_users = Invitation.objects.filter(calendar=calendar, status='declined')
        accepted_users = Invitation.objects.filter(calendar=calendar, status='accepted')
        pending_user_ids = [invitation.invited_user.id for invitation in pending_users]
        declined_user_ids = [invitation.invited_user.id for invitation in declined_users]
        accepted_user_ids = [invitation.invited_user.id for invitation in accepted_users]

        return JsonResponse({"pending_user_ids": pending_user_ids, "declined_user_ids": declined_user_ids,
                             "accepted_user_ids": accepted_user_ids})


class InvitedUserLandingView(APIView):
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    @staticmethod
    def get(self, request, *args, **kwargs):
        calendar_id = request.GET.get('calendar_id')
        calendar = get_object_or_404(Calendars, pk=calendar_id)
        owner_preferences = NonBusyTimeSerializer(calendar.nonbusytime_set.all(), many=True).data

        return JsonResponse({'owner_preferences': owner_preferences})

    @staticmethod
    def post(request, *args, **kwargs):
        calendar_id = request.POST.get('calendar_id')

        # TODO
        # availability_data = request.POST.get('availability_data')

        return JsonResponse({'detail': 'Availability data saved successfully'})


def send_email(invitation, inviter, email_type):
    from_name = inviter.name
    from_email = inviter.email
    to_email = invitation.invited_user.email
    calendar_name = invitation.calendar.name
    subject = message = ''

    if email_type == 'invitation':
        unique_link = f'link/notify/invitation_detail/{invitation.unique_token}/'
        subject = f'Invitation to Calendar {calendar_name} from {from_name}'
        message = (f'You have been invited to a calendar from {from_name}. '
                   f'Click the link below to view the details:\n\n{unique_link}')

    if email_type == 'reminder':
        unique_link = f'link/notify/invitation_detail/{invitation.unique_token}/'
        subject = 'Reminder to Calendar'
        message = f'You have been reminded of a calendar. Click the link below to view the details:\n\n{unique_link}'

    if email_type == 'confirm':
        unique_link = f'link/{invitation.unique_token}/'
        subject = 'Meeting Finalized'
        message = f'Your meeting with . Click the link below to view the details:\n\n{unique_link}'

    send_mail(
        subject,
        message,
        from_email,
        [to_email],
    )
