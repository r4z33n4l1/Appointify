from rest_framework import serializers
from .models import Invitation
from calendars.models import Calendars
from calendars.serializers import NonBusyDateSerializer
from contacts.models import Contact


class InvitationSerializer(serializers.ModelSerializer):
    calendar = serializers.PrimaryKeyRelatedField(queryset=Calendars.objects.all())
    invited_contact = serializers.PrimaryKeyRelatedField(queryset=Contact.objects.all())
    invited_contact_non_busy_dates = NonBusyDateSerializer(many=True)

    class Meta:
        model = Invitation
        fields = ['id', 'calendar', 'invited_contact', 'status', 'invited_contact_non_busy_dates', 'unique_token']
