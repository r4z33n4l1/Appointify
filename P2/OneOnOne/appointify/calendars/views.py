# views.py

from rest_framework import viewsets, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from calendars.models import Calendars, UserCalendars, NonBusyDate
from .serializers import CalendarSerializer, UserCalendarSerializer, NonBusyDateSerializer


# user calendar views
class UserCalendarListView(APIView):
    def get(self, request, *args, **kwargs):
        instances = UserCalendars.objects.filter(user=kwargs.get('user'))
        serializer = UserCalendarSerializer(instances, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserCalendarCreateView(APIView):
    def post(self, request, *args, **kwargs):
        instance = get_object_or_404(UserCalendars, user=kwargs.get('user'), calendar=kwargs.get('cid'))
        serializer = UserCalendarSerializer(instance, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserCalendarUpdateView(APIView):
    def put(self, request, *args, **kwargs):
        instance = get_object_or_404(UserCalendars, user=kwargs.get('user'), calendar=kwargs.get('cid'))
        serializer = UserCalendarSerializer(instance, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, *args, **kwargs):
        instance = get_object_or_404(UserCalendars, user=kwargs.get('user'), calendar=kwargs.get('cid'))
        serializer = UserCalendarSerializer(instance, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserCalendarDeleteView(generics.RetrieveDestroyAPIView):
    queryset = UserCalendars.objects.all()
    serializer_class = UserCalendarSerializer

    def delete(self, request, *args, **kwargs):
        user_id = kwargs.get('user')
        calendar_id = kwargs.get('pk')

        # Retrieve the UserCalendars instance based on user and calendar IDs
        user_calendar_instance = UserCalendars.objects.get(user=user_id, calendar=calendar_id)

        if user_calendar_instance:
            calendar_instance = user_calendar_instance.calendar
            user_calendar_instance.delete()  # Delete the UserCalendars instance
            calendar_instance.delete()  # Delete the associated Calendar instance

            return Response({'detail': 'Entry deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)


class UserCalendarsView(APIView):
    def get(self, request, *args, **kwargs):
        instances = UserCalendars.objects.filter(user=kwargs.get('user'))
        calendars_instances = [user_calendar.calendar for user_calendar in instances]
        serializer = CalendarSerializer(calendars_instances, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CalendarCreateView(APIView):
    def post(self, request, *args, **kwargs):
        user_id = kwargs.get('user')
        serializer = CalendarSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            # Create and save UserCalendars instance with user and calendar ID
            user_calendar_serializer = UserCalendarSerializer(
                data={'user': user_id, 'calendar': serializer.instance.id})
            if user_calendar_serializer.is_valid():
                user_calendar_serializer.save()

                return Response(serializer.data, status=status.HTTP_201_CREATED)

            # If UserCalendarSerializer is not valid, delete the created calendar
            serializer.instance.delete()

            return Response(user_calendar_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CalendarUpdateView(APIView):
    def put(self, request, *args, **kwargs):
        instance = get_object_or_404(UserCalendars, user=kwargs.get('user'), calendar=kwargs.get('cid'))
        serializer = CalendarSerializer(instance.calendar, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, *args, **kwargs):
        instance = get_object_or_404(UserCalendars, user=kwargs.get('user'), calendar=kwargs.get('cid'))
        serializer = CalendarSerializer(instance.calendar, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
