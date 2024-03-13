from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from calendars.models import Calendars, UserCalendars
from .models import Event
from notify.models import Invitation
from .scheduler import generate_meeting_schedules, find_common_times

from rest_framework import status
from django.contrib.auth import get_user_model
from contacts.serializers import ContactSerializer
from calendars.serializers import NonBusyDateSerializer

from collections import defaultdict
from django.db import transaction
from .models import ScheduleGroup


class EventSchedulerView(APIView):
    permission_classes = [IsAuthenticated]

    def get_calendar_info(self, request, calendar_id):
        calendar = get_object_or_404(Calendars, id=calendar_id, usercalendars__user=request.user)

        # Initialize dictionaries for different invitation statuses
        guests_info = {
            'accepted': [],
            'declined': [],
            'pending': []
        }

        # Fetch all invitations for this calendar
        invitations = Invitation.objects.filter(calendar=calendar).select_related('invited_contact')

        for invitation in invitations:
            contact_info = ContactSerializer(invitation.invited_contact).data
            contact_info['status'] = invitation.status

            if invitation.status == 'accepted':
                # Only for accepted, we include non-busy dates
                contact_info['non_busy_dates'] = NonBusyDateSerializer(invitation.invited_contact_non_busy_dates.all(),
                                                                       many=True).data
                guests_info['accepted'].append(contact_info)
            elif invitation.status == 'declined':
                guests_info['declined'].append(contact_info)
            else:  # pending
                guests_info['pending'].append(contact_info)

        # Serialize user's non-busy dates
        user_calendar = get_object_or_404(UserCalendars, user=request.user, calendar=calendar)
        user_non_busy_dates = NonBusyDateSerializer(user_calendar.non_busy_dates.all(), many=True).data

        user_info = {
            'user_id': request.user.username,
            'user_non_busy_dates': user_non_busy_dates,
        }

        return user_info, guests_info

    def preprocess_availability(self, user_info, guests_info):
        availability = defaultdict(lambda: defaultdict(lambda: set()))

        # User's availability
        for date_info in user_info['user_non_busy_dates']:
            date = date_info['date']
            for time_info in date_info['non_busy_times']:
                availability[date][time_info['time']].add(user_info['user_id'])

        # Guests' availability
        for guest in guests_info['accepted']:
            for date_info in guest['non_busy_dates']:
                date = date_info['date']
                for time_info in date_info['non_busy_times']:
                    availability[date][time_info['time']].add(guest['fname'])

        return availability

    def get(self, request, *args, **kwargs):
        calendar_id = request.query_params.get('calendar_id')
        if not calendar_id:
            return Response({'error': 'Calendar ID is required.'}, status=400)

        # Ensure the calendar belongs to the requesting user
        calendar = get_object_or_404(Calendars, id=calendar_id, usercalendars__user=request.user)

        user_info, guests_info = self.get_calendar_info(request, calendar_id)

        # Check for pending guests
        if guests_info['pending']:
            pending_guest_names = [guest['fname'] for guest in guests_info['pending']]
            return Response({'error': 'Pending invitations exist for: {}'.format(', '.join(pending_guest_names))},
                            status=400)

        # Generate schedules, ensuring the function now returns detailed schedule information
        schedule_result = generate_meeting_schedules(user_info, guests_info, calendar_id)

        if 'error' in schedule_result:
            return Response(schedule_result, status=status.HTTP_400_BAD_REQUEST)

        # If schedules were successfully generated, include the schedule group ID and details in the response
        return Response(schedule_result, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        calendar_id = request.data.get('calendar_id')
        schedule_group_id = request.data.get('schedule_group_id')

        # Validate calendar and schedule group
        calendar = get_object_or_404(Calendars, id=calendar_id, usercalendars__user=request.user)
        if calendar.isfinalized:
            return Response({'detail': 'Calendar is already finalized.'}, status=400)
        schedule_group = get_object_or_404(ScheduleGroup, id=schedule_group_id, owner=request.user, calendar=calendar)
        created_events = []
        with transaction.atomic():
            # Create an event object for each schedule in the schedule group
            for schedule in schedule_group.schedules.all():
                event = Event.objects.create(
                    calendar=calendar,
                    owner=request.user,
                    contact=schedule.contact,
                    start_time=schedule.start_time,
                    end_time=schedule.end_time,
                )
                created_events.append({
                    'event_id': event.id,
                    'start_time': event.start_time.strftime('%Y-%m-%d %H:%M:%S'),
                    'end_time': event.end_time.strftime('%Y-%m-%d %H:%M:%S'),
                    'contact': event.contact.fname
                })

            calendar.isfinalized = True
            calendar.save()

            # Optionally, you may want to return some information about the created events
            # or simply confirm the operation's success
            return Response({"detail": "Events created and calendar finalized successfully.", "events": created_events})

        # If we get here, something went wrong
        return Response({'error': 'An unexpected error occurred.'}, status=status.HTTP_400_BAD_REQUEST)


class AvailabilityDataView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        calendar_id = request.query_params.get('calendar_id')
        if not calendar_id:
            return Response({'error': 'Calendar ID is required.'}, status=400)

        calendar_info = EventSchedulerView().get_calendar_info(request, calendar_id)
        return Response(calendar_info)
