from rest_framework import serializers
from calendars.serializers import CalendarSerializer, NonBusyDateSerializer
from .models import Invitation


class InvitationSerializer(serializers.ModelSerializer):
    calendar = CalendarSerializer()
    invited_user_non_busy_dates = NonBusyDateSerializer(many=True)

    class Meta:
        model = Invitation
        fields = ['id', 'calendar', 'invited_user', 'status', 'invited_user_non_busy_dates', 'unique_token']
