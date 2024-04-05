# serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Calendars, UserCalendars, NonBusyDate, NonBusyTime
from django.shortcuts import get_object_or_404
from django.db.models import Q


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email')


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
        non_busy_date, created = NonBusyDate.objects.get_or_create(**validated_data)

        for non_busy_time_data_item in non_busy_time_data:
            non_busy_time, created = NonBusyTime.objects.get_or_create(**non_busy_time_data_item)
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
        fields = ('id', 'user', 'calendar', 'non_busy_dates')
        read_only_fields = ('id', 'user', 'calendar')

    def create(self, validated_data):
        non_busy_dates_data = validated_data.pop('non_busy_dates', [])
        user = self.context['request'].user
        calendar_id = self.context['view'].kwargs['cid']
        calendar = get_object_or_404(Calendars, pk=calendar_id)
        user_calendar = UserCalendars.objects.create(user=user, calendar=calendar)

        # Process non_busy_dates_data to check for duplicates and create new entries
        for non_busy_date_data in non_busy_dates_data:
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
                # Only add the non_busy_time if it was created to avoid duplicates
                if time_created:
                    non_busy_date.non_busy_times.add(non_busy_time)

            # Only add the non_busy_date if it was created to avoid duplicates
            if date_created:
                user_calendar.non_busy_dates.add(non_busy_date)

        return user_calendar

    def update(self, instance, validated_data):
        # Clearing all existing associations is not necessary
        incoming_dates = {item.get('date') for item in validated_data.get('non_busy_dates', [])}
        
        # Delete NonBusyDate instances not in incoming_dates
        NonBusyDate.objects.filter(usercalendars=instance).exclude(date__in=incoming_dates).delete()

        for non_busy_date_data in validated_data.get('non_busy_dates', []):
            date = non_busy_date_data.get('date')
            non_busy_date, _ = NonBusyDate.objects.get_or_create(date=date)
            
            incoming_times = {item.get('time') for item in non_busy_date_data.get('non_busy_times', [])}
            
            # Delete NonBusyTime instances not in incoming_times for each NonBusyDate
            non_busy_date.non_busy_times.exclude(time__in=incoming_times).delete()

            for non_busy_time_data in non_busy_date_data.get('non_busy_times', []):
                time = non_busy_time_data.get('time')
                preference = non_busy_time_data.get('preference')
                
                non_busy_time, created = NonBusyTime.objects.get_or_create(time=time, defaults={'preference': preference})
                if not created:
                    non_busy_time.preference = preference
                    non_busy_time.save()
                
                non_busy_date.non_busy_times.add(non_busy_time)
            
            instance.non_busy_dates.add(non_busy_date)

        instance.save()
        return instance
