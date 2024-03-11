from django.urls import path
from .views import *

urlpatterns = [
    path('calendars/<int:calendar_id>/invite/', InviteToCalendarSendEmailView.as_view(), name='send_invitation_email'),
    path('calendars/reminder/<int:calendar_id>/<int:contact_id>/', ReminderView.as_view(), name='reminder'),
    path('calendars/<int:pk>/notify_finalized/', NotifyFinalizedScheduleView.as_view(), name='notify_finalized_schedule'),
    path('calendars/<int:pk>/status/', StatusView.as_view(), name='status_view'),
    path('notify/invited_user_landing/', InvitedUserLandingView.as_view(), name='invited_user_landing'),
]
