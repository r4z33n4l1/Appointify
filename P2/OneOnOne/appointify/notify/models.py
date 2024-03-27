from django.db import models
import uuid
from calendars.models import Calendars, NonBusyDate
from contacts.models import Contact  # Ensure this import points to your Contact model


class Invitation(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('declined', 'Declined'),
        ('accepted', 'Accepted'),
    ]

    calendar = models.ForeignKey(Calendars, on_delete=models.CASCADE)
    invited_contact = models.ForeignKey(Contact, on_delete=models.CASCADE)  # Updated field
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    unique_token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    invited_contact_non_busy_dates = models.ManyToManyField('calendars.NonBusyDate', blank=True)  # Updated field
    objects = models.Manager()

    # If you need methods or additional logic for handling the invitation, add them here
