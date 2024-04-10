from django.contrib import admin

# Register your models here.
from .models import Event, Schedule, ScheduleGroup

admin.site.register(Event)
admin.site.register(Schedule)
admin.site.register(ScheduleGroup)