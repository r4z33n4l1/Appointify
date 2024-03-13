from django.db import models

# Create your models here.
# calendars/models.py
from django.contrib.auth.models import User


class Calendars(models.Model):
    class Meta:
        app_label = 'calendars'

    name = models.CharField(max_length=50)
    description = models.TextField(max_length=200, blank=True)
    start_date = models.DateField()
    end_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    isfinalized = models.BooleanField(default=False)

class UserCalendars(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    calendar = models.ForeignKey(Calendars, on_delete=models.CASCADE)
    non_busy_dates = models.ManyToManyField('NonBusyDate', blank=True)

    class Meta:
        unique_together = ('user', 'calendar')


class NonBusyDate(models.Model):
    date = models.DateField()
    non_busy_times = models.ManyToManyField('NonBusyTime', blank=True)


class NonBusyTime(models.Model):
    PREFERENCE_CHOICES = [
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low'),
    ]
    time = models.TimeField()
    preference = models.CharField(max_length=20, choices=PREFERENCE_CHOICES, default='medium')
