# serializers.py
from rest_framework import serializers
from .models import Calendars, UserCalendars, NonBusyDate, NonBusyTime


class CalendarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Calendars
        fields = '__all__'


class NonBusyTimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = NonBusyTime
        fields = '__all__'


class NonBusyDateSerializer(serializers.ModelSerializer):
    non_busy_times = NonBusyTimeSerializer(many=True)

    class Meta:
        model = NonBusyDate
        fields = '__all__'

    def create(self, validated_data):
        non_busy_time_data = validated_data.pop('non_busy_times', [])
        non_busy_date = NonBusyDate.objects.create(**validated_data)

        for non_busy_time_data_item in non_busy_time_data:
            non_busy_time = NonBusyTime.objects.create(**non_busy_time_data_item)
            non_busy_date.non_busy_times.add(non_busy_time)

        return non_busy_date

    def update(self, instance, validated_data):
        instance.date = validated_data.get('date', instance.date)
        instance.save()

        # Update non_busy_dates
        non_busy_times_data = validated_data.get('non_busy_times', [])
        instance.non_busy_times.clear()

        for non_busy_time_data in non_busy_times_data:
            non_busy_time_serializer = NonBusyTimeSerializer(data=non_busy_time_data)
            non_busy_time_serializer.is_valid(raise_exception=True)
            non_busy_time_serializer.save()
            instance.non_busy_times.add(non_busy_time_serializer.instance)

        return instance


class UserCalendarSerializer(serializers.ModelSerializer):
    non_busy_dates = NonBusyDateSerializer(many=True, required=False)

    class Meta:
        model = UserCalendars
        fields = '__all__'

    def create(self, validated_data):
        non_busy_dates_data = validated_data.pop('non_busy_dates', [])
        user_calendar = UserCalendars.objects.create(**validated_data)

        for non_busy_date_data in non_busy_dates_data:
            non_busy_date_serializer = NonBusyDateSerializer(data=non_busy_date_data)
            non_busy_date_serializer.is_valid(raise_exception=True)
            non_busy_date_serializer.save()

            user_calendar.non_busy_dates.add(non_busy_date_serializer.instance)

        return user_calendar

    def update(self, instance, validated_data):
        instance.calendar = validated_data.get('calendar', instance.calendar)
        instance.save()

        # Update non_busy_dates
        non_busy_dates_data = validated_data.get('non_busy_dates', [])
        instance.non_busy_dates.clear()

        for non_busy_date_data in non_busy_dates_data:
            non_busy_date_serializer = NonBusyDateSerializer(data=non_busy_date_data)
            non_busy_date_serializer.is_valid(raise_exception=True)
            non_busy_date_serializer.save()
            instance.non_busy_dates.add(non_busy_date_serializer.instance)

        return instance
