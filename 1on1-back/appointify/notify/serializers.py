from rest_framework import serializers
from .models import Invitation
from calendars.models import Calendars
from calendars.serializers import NonBusyDateSerializer
from calendars.models import NonBusyDate, NonBusyTime
from contacts.models import Contact


class InvitationSerializer(serializers.ModelSerializer):
    calendar = serializers.PrimaryKeyRelatedField(queryset=Calendars.objects.all())
    invited_contact = serializers.PrimaryKeyRelatedField(queryset=Contact.objects.all())
    invited_contact_non_busy_dates = NonBusyDateSerializer(many=True, required=False)

    class Meta:
        model = Invitation
        fields = ['id', 'calendar', 'invited_contact', 'status', 'invited_contact_non_busy_dates', 'unique_token']

    def create(self, validated_data):
        # Delete all existing non_busy_dates for this invitation
        # Invitation.objects.get(id=instance.id).invited_contact_non_busy_dates.clear()

        invited_contact_non_busy_dates_data = validated_data.pop('invited_contact_non_busy_dates', [])
        invitation = Invitation.objects.create(**validated_data)

        for non_busy_date_data in invited_contact_non_busy_dates_data:
            date = non_busy_date_data.get('date')
            non_busy_times_data = non_busy_date_data.pop('non_busy_times', [])
            non_busy_date, date_created = NonBusyDate.objects.get_or_create(date=date)

            for non_busy_time_data in non_busy_times_data:
                time = non_busy_time_data.get('time')
                preference = non_busy_time_data.get('preference')
                non_busy_time, time_created = NonBusyTime.objects.get_or_create(
                    time=time,
                    defaults={'preference': preference}
                )
                non_busy_date.non_busy_times.add(non_busy_time)

            invitation.invited_contact_non_busy_dates.add(non_busy_date)

        return invitation

    def update(self, instance, validated_data):
        # Delete all existing non_busy_dates for this invitation
        instance.invited_contact_non_busy_dates.clear()

        invited_contact_non_busy_dates_data = validated_data.get('invited_contact_non_busy_dates', [])
        for non_busy_date_data in invited_contact_non_busy_dates_data:
            date = non_busy_date_data.get('date')
            non_busy_times_data = non_busy_date_data.get('non_busy_times', [])
            non_busy_date, date_created = NonBusyDate.objects.get_or_create(date=date)

            for non_busy_time_data in non_busy_times_data:
                time = non_busy_time_data.get('time')
                preference = non_busy_time_data.get('preference')
                non_busy_time, time_created = NonBusyTime.objects.get_or_create(
                    time=time,
                    defaults={'preference': preference}
                )
                non_busy_date.non_busy_times.add(non_busy_time)

            instance.invited_contact_non_busy_dates.add(non_busy_date)

        instance.save()
        return instance