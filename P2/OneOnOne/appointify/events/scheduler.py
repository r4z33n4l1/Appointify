# scheduler.py
import random
# scheduler.py
from collections import defaultdict
from datetime import datetime, timedelta
from django.utils.dateparse import parse_date, parse_time

from django.contrib.auth import get_user_model
from calendars.models import Calendars
from .models import Schedule, ScheduleGroup
from django.shortcuts import get_object_or_404
from rest_framework import status
from contacts.models import Contact

import itertools
from django.db import transaction
from datetime import datetime, timedelta
from django.shortcuts import get_object_or_404
from .models import Calendars, User, Contact, Schedule, ScheduleGroup


def find_common_times(availability):
    """
    Expects `availability` to be a dictionary where:
    - each key is a date (str),
    - each value is another dictionary with keys as user IDs and values as sets of available times (str) for that user.
    """
    common_times = defaultdict(list)

    # Iterate through each date in the availability data
    for date, users_availabilities in availability.items():
        # Prepare a list of sets, each representing the available times of one user
        times_list = [set(times) for times in users_availabilities.values()]
        
        # Find the intersection of all sets in times_list to get common available times
        if times_list:  # Ensure the list is not empty
            common_times_for_date = set.intersection(*times_list)
            common_times[date] = list(common_times_for_date)

    return dict(common_times)


def parse_datetime(date_str, time_str):
    """Helper function to parse date and time strings into a datetime object."""
    return datetime.strptime(f"{date_str}T{time_str}", "%Y-%m-%dT%H:%M:%S")

@transaction.atomic
def generate_meeting_schedules(user_availability, guests_availability, calendar_id, num_schedule_groups=2):
    calendar = get_object_or_404(Calendars, pk=calendar_id)
    owner = get_object_or_404(User, username=user_availability['user_id'])
    
    # Prepare availability data
    user_times = {date_info['date']: set(time_info['time'] for time_info in date_info['non_busy_times']) for date_info in user_availability['user_non_busy_dates']}
    guest_times = {guest_info['id']: {date_info['date']: set(time_info['time'] for time_info in date_info['non_busy_times']) for date_info in guest_info['non_busy_dates']} for guest_info in guests_availability['accepted']}
    
    schedule_groups_data = []

    for _ in range(num_schedule_groups):
        schedule_group = ScheduleGroup.objects.create(calendar=calendar, owner=owner)
        scheduled_guests = set()

        for date, times in user_times.items():
            for guest_id, guest_available_times in guest_times.items():
                if guest_id in scheduled_guests:
                    continue  # Skip guests who have already been scheduled in this group
                
                # Find a common time for the guest and the user on this date
                for time in times:
                    if time in guest_available_times.get(date, set()):
                        start_datetime = parse_datetime(date, time)
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
                        scheduled_guests.add(guest_id)  # Mark guest as scheduled
                        break  # Move to the next guest after successfully scheduling
                
                if len(scheduled_guests) == len(guests_availability['accepted']):
                    break  # All guests are scheduled in this group
        
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
