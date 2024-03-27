# calendars/admin.py
from django.contrib import admin
from .models import Calendars, UserCalendars, NonBusyDate, NonBusyTime

admin.site.register(Calendars)
admin.site.register(UserCalendars)
admin.site.register(NonBusyDate)
admin.site.register(NonBusyTime)