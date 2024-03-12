from rest_framework import serializers
from .models import Invitation
from calendars.models import Calendars
from contacts.models import Contact


class InvitationSerializer(serializers.ModelSerializer):
    calendar = serializers.PrimaryKeyRelatedField(queryset=Calendars.objects.all())
    invited_contact = serializers.PrimaryKeyRelatedField(queryset=Contact.objects.all())

    class Meta:
        model = Invitation
        fields = ['id', 'calendar', 'invited_contact', 'status', 'unique_token']
