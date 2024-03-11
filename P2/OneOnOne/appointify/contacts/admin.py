from django.contrib import admin
from .models import Contact

@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('fname', 'lname', 'email', 'is_registered', 'user')
    search_fields = ('fname', 'lname', 'email')
    list_filter = ('is_registered', 'user')
