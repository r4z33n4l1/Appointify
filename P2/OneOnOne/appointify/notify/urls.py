from django.urls import path
from .views import *

urlpatterns = [
    path('calendars/invite/', InviteToCalendarSendEmailView.as_view(), name='send_invitation'),
    path('calendars/reminder/', ReminderView.as_view(), name='reminder'),
    path('calendars/notify_finalized/', NotifyFinalizedScheduleView.as_view(), name='notify_finalized_schedule'),
    path('calendars/status/', StatusView.as_view(), name='status_view'),
    path('invited_user_landing/<uuid:unique_link>/', InvitedUserLandingView.as_view(), name='invited_user_landing'),
    path('invited_user_landing/<uuid:unique_link>/decline/', DeclineInvitationView.as_view(), name='decline_invitation'),
]
