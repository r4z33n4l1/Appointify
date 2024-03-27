# views.py

from rest_framework import viewsets, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from calendars.models import Calendars, UserCalendars, NonBusyDate
from .serializers import CalendarSerializer, UserCalendarSerializer, NonBusyDateSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination

import datetime
# user calendar views
class UserCalendarListView(APIView):
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination

    def get(self, request, *args, **kwargs):
        user = request.user
        is_finalized = request.query_params.get('isfinalized', None)
        instances = UserCalendars.objects.filter(user=user.id)
        
        if is_finalized is not None:
            instances = instances.filter(calendar__isfinalized=is_finalized)
        
        paginator = self.pagination_class()
        paginated_instances = paginator.paginate_queryset(instances, request)
        serializer = UserCalendarSerializer(paginated_instances, many=True)
        return paginator.get_paginated_response(serializer.data)


class UserCalendarCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        calendar_id = kwargs.get('cid')  # Extracting 'cid' from the URL

        # Check if the UserCalendars instance already exists
        user_calendar_instance, created = UserCalendars.objects.get_or_create(
            user=user,
            calendar_id=calendar_id,
        )

        # If the instance already exists, do not attempt to recreate it
        if not created:
            return Response({
                'message': 'The calendar is already associated with the user.'
            }, status=status.HTTP_409_CONFLICT)

        # Serialize the non_busy_dates data if provided
        non_busy_dates_data = request.data.get('non_busy_dates', [])
        non_busy_dates = []
        for non_busy_date_data in non_busy_dates_data:
            non_busy_date_serializer = NonBusyDateSerializer(data=non_busy_date_data)
            non_busy_date_serializer.is_valid(raise_exception=True)
            non_busy_date = non_busy_date_serializer.save()
            non_busy_dates.append(non_busy_date)

        # Add non_busy_dates to the user_calendar_instance
        user_calendar_instance.non_busy_dates.set(non_busy_dates)

        # Prepare the response data
        serializer = UserCalendarSerializer(user_calendar_instance)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class UserCalendarUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        user = request.user
        instance = get_object_or_404(UserCalendars, user=user, calendar=kwargs.get('cid'))
        context = {'request': request, 'view': self}
        serializer = UserCalendarSerializer(instance, data=request.data, context=context, partial=False)

        # if calendar is finalized, return error
        if instance.calendar.isfinalized:
            return Response({'message': 'Calendar finalized.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # check if dates are within the calendar's date range
        non_busy_dates = request.data.get('non_busy_dates', [])
        for non_busy_date in non_busy_dates:
            date = datetime.datetime.strptime(non_busy_date.get('date'), '%Y-%m-%d').date()
            if date < instance.calendar.start_date or date > instance.calendar.end_date:
                return Response({'message': f'{non_busy_date.get("date")} is not within the calendar date range.'}, status=status.HTTP_400_BAD_REQUEST)
            
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, *args, **kwargs):
        user = request.user
        instance = get_object_or_404(UserCalendars, user=user, calendar=kwargs.get('cid'))
        context = {'request': request, 'view': self}
        serializer = UserCalendarSerializer(instance, data=request.data, partial=True, context=context)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserCalendarDeleteView(generics.RetrieveDestroyAPIView):
    queryset = UserCalendars.objects.all()
    serializer_class = UserCalendarSerializer
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        user = request.user
        calendar_id = kwargs.get('pk')

        # Retrieve the UserCalendars instance based on user and calendar IDs
        user_calendar_instance = UserCalendars.objects.get(user=user.id, calendar=calendar_id)

        if user_calendar_instance:
            calendar_instance = user_calendar_instance.calendar
            user_calendar_instance.delete()  # Delete the UserCalendars instance
            calendar_instance.delete()  # Delete the associated Calendar instance

            return Response({'detail': 'Entry deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)


class UserCalendarsView(APIView):
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination

    def get(self, request, *args, **kwargs):
        user = request.user
        instances = UserCalendars.objects.filter(user=user.id)
        paginator = self.pagination_class()
        paginated_instances = paginator.paginate_queryset(instances, request)
        calendars_instances = [user_calendar.calendar for user_calendar in paginated_instances]
        serializer = CalendarSerializer(calendars_instances, many=True)
        return paginator.get_paginated_response(serializer.data)


class CalendarCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        calendar_serializer = CalendarSerializer(data=request.data)

        if calendar_serializer.is_valid():
            calendar = calendar_serializer.save()  # Save the calendar and get the instance

            # Create a UserCalendars instance linking the user to the newly created calendar
            # Note: non_busy_dates are not being handled here, as they are not required initially
            user_calendar = UserCalendars.objects.create(user=user, calendar=calendar)

            # Prepare a response using the CalendarSerializer to include the new calendar details
            response_data = calendar_serializer.data
            response_data['user_calendar_id'] = user_calendar.id  # Optionally include the UserCalendar ID

            return Response(response_data, status=status.HTTP_201_CREATED)
        else:
            return Response(calendar_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CalendarUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        user = request.user
        instance = get_object_or_404(UserCalendars, user=user.id, calendar=kwargs.get('cid'))
        calendar = instance.calendar
    
        if calendar.isfinalized:
            return Response({'message': 'Calendar finalized.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = CalendarSerializer(calendar, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # def patch(self, request, *args, **kwargs):
    #     user = request.user
    #     instance = get_object_or_404(UserCalendars, user=user.id, calendar=kwargs.get('cid'))
    #     serializer = CalendarSerializer(instance.calendar, data=request.data, partial=True)

    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data, status=status.HTTP_200_OK)

    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
