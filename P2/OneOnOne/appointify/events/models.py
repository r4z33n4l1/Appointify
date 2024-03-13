from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User

from calendars.models import Calendars
from notify.models import Invitation
from contacts.models import Contact

User = get_user_model()


class Event(models.Model):
    calendar = models.ForeignKey(Calendars, on_delete=models.CASCADE)
    owner = models.ForeignKey(User, related_name='owned_events', on_delete=models.CASCADE)
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE)

    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    status = models.CharField(max_length=20, choices=Invitation.STATUS_CHOICES, default='pending')


class Schedule(models.Model):
    calendar = models.ForeignKey(Calendars, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    owner = models.ForeignKey(User, related_name='schedules', on_delete=models.CASCADE)
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE)


class ScheduleGroup(models.Model):
    schedules = models.ManyToManyField(Schedule, related_name='schedule_groups')
    calendar = models.ForeignKey(Calendars, on_delete=models.CASCADE, related_name='schedule_groups')
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='schedule_groups')
