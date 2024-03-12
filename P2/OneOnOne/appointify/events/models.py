from django.db import models

# Create your models here.
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import User
from calendars.models import Calendars
from notify.models import Invitation


class Event(models.Model):
    calendar = models.ForeignKey(Calendars, on_delete=models.CASCADE)
    owner = models.ForeignKey(User, related_name='owned_events', on_delete=models.CASCADE)
    
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    guest_object = GenericForeignKey('content_type', 'object_id')

    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    status = models.CharField(max_length=20, choices=Invitation.STATUS_CHOICES, default='pending')
