from rest_framework import serializers
from calendars.serializers import CalendarSerializer
from .models import Invitation


class InvitationSerializer(serializers.ModelSerializer):
    calendar = CalendarSerializer()

    class Meta:
        model = Invitation
        fields = ['id', 'calendar', 'invited_user', 'status', 'unique_token']

    def create(self, validated_data):
        calendar_data = validated_data.pop('calendar')
        calendar_serializer = CalendarSerializer(data=calendar_data)
        calendar_serializer.is_valid(raise_exception=True)
        calendar = calendar_serializer.save()

        invitation = Invitation.objects.create(calendar=calendar, **validated_data)
        return invitation

    def update(self, instance, validated_data):
        calendar_data = validated_data.pop('calendar', None)

        if calendar_data:
            calendar_serializer = CalendarSerializer(instance.calendar, data=calendar_data)
            calendar_serializer.is_valid(raise_exception=True)
            calendar_serializer.save()

        instance.status = validated_data.get('status', instance.status)
        instance.save()

        return instance
