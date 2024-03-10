# calendars/urls.py

from django.urls import path
from .views import UserCalendarListView, UserCalendarCreateView, UserCalendarDeleteView, CalendarCreateView, CalendarListView, UserCalendarUpdateView, CalendarUpdateView, CalendarDeleteView

urlpatterns = [
    # user-calendar urls
    path('user-calendars/', UserCalendarListView.as_view(), name='user-calendar-list'),
    path('user-calendars/create/', UserCalendarCreateView.as_view(), name='user-calendar-create'),
    path('user-calendars/update/<int:pk>/', UserCalendarUpdateView.as_view(), name='user-calendar-update'),
    path('user-calendars/delete/<int:pk>/', UserCalendarDeleteView.as_view(), name='user-calendar-delete'),

    # calendar urls
    path('calendars/', CalendarListView.as_view(), name='calendar-list'),
    path('calendars/create/', CalendarCreateView.as_view(), name='calendar-create'),
    path('calendars/update/<int:pk>/', CalendarUpdateView.as_view(), name='calendar-update'),
    path('calendars/delete/<int:pk>/', CalendarDeleteView.as_view(), name='calendar-delete'),
]
