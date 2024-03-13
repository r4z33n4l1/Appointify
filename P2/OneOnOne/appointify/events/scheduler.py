# scheduler.py

from collections import defaultdict
from django.db import transaction
from datetime import datetime, timedelta
from django.shortcuts import get_object_or_404
from django.utils.timezone import make_aware
from .models import Calendars, User, Contact, Schedule, ScheduleGroup


def find_common_times(user_availability, guests_availability):
    preference_order = {'low': 3, 'medium': 2, 'high': 1}
    common_times = defaultdict(list)

    for date, user_slots in user_availability.items():
        for guest_id, guest_slots in guests_availability.items():
            for user_slot in user_slots:
                for guest_slot in guest_slots.get(date, []):
                    if user_slot['time'] == guest_slot['time']:
                        common_times[guest_id].append({
                            'date': date,
                            'time': user_slot['time'],
                            'user_preference': user_slot['preference'],
                            'guest_preference': guest_slot['preference']
                        })

    for guest_id, times_list in common_times.items():
        sorted_times = sorted(times_list, key=lambda x: (preference_order.get(x['user_preference'], 4), preference_order.get(x['guest_preference'], 4), x['date'], x['time']))
        common_times[guest_id] = sorted_times

    return dict(common_times)


def parse_datetime(date_str, time_str):
    """Helper function to parse date and time strings into a datetime object."""
    return datetime.strptime(f"{date_str}T{time_str}", "%Y-%m-%dT%H:%M:%S")


@transaction.atomic
def generate_meeting_schedules(user_availability, guests_availability, calendar_id, num_schedule_groups=2):
    calendar = get_object_or_404(Calendars, pk=calendar_id)
    owner = get_object_or_404(User, username=user_availability['user_id'])

    # Delete previous schedule groups and associated schedules
    previous_schedule_groups = ScheduleGroup.objects.filter(calendar=calendar, owner=owner)
    for schedule_group in previous_schedule_groups:
        schedule_group.schedules.all().delete()  # Delete schedules inside the group
        schedule_group.delete()

    # Prepare availability data
    user_availability_data = {
        date_info['date']: [
            {'preference': time_info.get('preference'), 'time': time_info['time']}
            for time_info in date_info['non_busy_times']
        ] for date_info in user_availability['user_non_busy_dates']
    }
    guest_availability_data = {
        guest_info['id']: {
            date_info['date']: [
                {'preference': time_info.get('preference'), 'time': time_info['time']}
                for time_info in date_info['non_busy_times']
            ] for date_info in guest_info['non_busy_dates']
        } for guest_info in guests_availability['accepted']
    }

    # Find common times between user and guests
    common_times = find_common_times(user_availability_data, guest_availability_data)

    schedule_groups_data = []
    guest_used_times_diff_schedule = []
    for _ in range(num_schedule_groups):
        schedule_group = ScheduleGroup.objects.create(calendar=calendar, owner=owner)
        user_used_times = []
        for guest_id, common_time_slots in common_times.items():
            for common_time_slot in common_time_slots:
                date = common_time_slot['date']
                time = common_time_slot['time']
                if [guest_id, date, time] in guest_used_times_diff_schedule:
                    continue
                if [date, time] in user_used_times:
                    continue

                start_datetime = make_aware(parse_datetime(date, time))
                end_datetime = start_datetime + timedelta(hours=1)  # Assuming 1-hour meetings
                guest_contact = get_object_or_404(Contact, id=guest_id)

                # Create schedule
                schedule_instance = Schedule.objects.create(
                    calendar=calendar,
                    start_time=start_datetime,
                    end_time=end_datetime,
                    owner=owner,
                    contact=guest_contact
                )
                schedule_group.schedules.add(schedule_instance)
                guest_used_times_diff_schedule.append([guest_id, date, time])
                user_used_times.append([date, time])
                break

        # Prepare data for response
        detailed_schedules = [{
            "schedule_id": schedule.id,
            "date": schedule.start_time.strftime("%Y-%m-%d"),
            "time": schedule.start_time.strftime("%H:%M:%S"),
            "owner": schedule.owner.username,
            "contact": schedule.contact.fname
        } for schedule in schedule_group.schedules.all()]

        if detailed_schedules:
            schedule_groups_data.append({
                "schedule_group_id": schedule_group.id,
                "schedules": detailed_schedules
            })
        else:
            # If no schedules were created, delete the empty schedule group
            schedule_group.delete()

    if not schedule_groups_data:
        return {"error": "Could not find suitable schedules for all guests."}

    return {"schedule_groups": schedule_groups_data}
