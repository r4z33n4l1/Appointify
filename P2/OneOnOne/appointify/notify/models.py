from django.db import models
import uuid
from django.contrib.auth.models import User
from calendars.models import Calendars, NonBusyDate

# Create your models here.


class Invitation(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('declined', 'Declined'),
        ('accepted', 'Accepted'),
    ]

    calendar = models.ForeignKey(Calendars, on_delete=models.CASCADE)
    invited_user = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    unique_token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    invited_user_non_busy_dates = models.ManyToManyField('calendars.NonBusyDate', blank=True, null=True)
    objects = models.Manager()