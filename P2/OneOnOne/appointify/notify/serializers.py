from rest_framework import serializers
from calendars.serializers import CalendarSerializer
from .models import Invitation


class InvitationSerializer(serializers.ModelSerializer):
    calendar = CalendarSerializer()

    class Meta:
        model = Invitation
        fields = ['id', 'calendar', 'invited_user', 'status', 'unique_token']
