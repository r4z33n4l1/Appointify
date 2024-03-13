from rest_framework import serializers
from .models import Event, Contact


class EventsSerializer(serializers.ModelSerializer):
    contact_email = serializers.EmailField(source='contact.email', read_only=True)
    contact_full_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Event
        fields = ['id', 'calendar', 'start_time', 'end_time', 'contact_email', 'contact_full_name']

    @staticmethod
    def get_contact_full_name(obj):
        return f"{obj.contact.fname} {obj.contact.lname}"
