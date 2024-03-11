# calendars/urls.py

from django.urls import path
from .views import UserCalendarListView, UserCalendarCreateView, UserCalendarDeleteView, CalendarCreateView, UserCalendarUpdateView, CalendarUpdateView, UserCalendarsView

urlpatterns = [
    # user-calendar urls
    path('<int:user>/user-calendars/', UserCalendarListView.as_view(), name='user-calendar-list'),
    path('<int:user>/user-calendars/<int:cid>/create/', UserCalendarCreateView.as_view(), name='user-calendar-create'),
    path('<int:user>/user-calendars/<int:cid>/update/', UserCalendarUpdateView.as_view(), name='user-calendar-update'),
    path('<int:user>/user-calendars/<int:pk>/delete/', UserCalendarDeleteView.as_view(), name='user-calendar-delete'),

    # calendar urls
    path('<int:user>/calendars/', UserCalendarsView.as_view(), name='calendar-list'),
    path('<int:user>/calendars/create/', CalendarCreateView.as_view(), name='calendar-create'),
    path('<int:user>/calendars/update/<int:cid>/', CalendarUpdateView.as_view(), name='calendar-update'), 
]
