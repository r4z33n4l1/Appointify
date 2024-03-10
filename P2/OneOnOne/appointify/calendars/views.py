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
        queryset = UserCalendars.objects.all()
        serializer = UserCalendarSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserCalendarCreateView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = UserCalendarSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)    

class UserCalendarUpdateView(APIView):
    def put(self, request, *args, **kwargs):
        instance = self.get_object(kwargs.get('pk'))
        serializer = UserCalendarSerializer(instance, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, *args, **kwargs):
        instance = get_object_or_404(UserCalendars, pk=kwargs.get('pk'))
        serializer = UserCalendarSerializer(instance, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)    

class UserCalendarDeleteView(generics.RetrieveDestroyAPIView):
    queryset = UserCalendars.objects.all()
    serializer_class = UserCalendarSerializer 

    def delete(self, request, *args, **kwargs):
        user_calendar_instance = self.get_object()
        calendar_instance = user_calendar_instance.calendar
        calendar_instance.delete()
        return self.destroy(request, *args, **kwargs)
                                     

# calendar views
class CalendarListView(APIView):
    def get(self, request, *args, **kwargs):
        queryset = Calendars.objects.all()
        serializer = CalendarSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)   

class CalendarCreateView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = CalendarSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                                           
class CalendarUpdateView(APIView):
    def put(self, request, *args, **kwargs):
        instance = get_object_or_404(Calendars, pk=kwargs.get('pk'))
        serializer = CalendarSerializer(instance, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, *args, **kwargs):
        instance = get_object_or_404(Calendars, pk=kwargs.get('pk'))
        serializer = CalendarSerializer(instance, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  

class CalendarDeleteView(generics.RetrieveDestroyAPIView):
    queryset = Calendars.objects.all()
    serializer_class = CalendarSerializer 

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)
