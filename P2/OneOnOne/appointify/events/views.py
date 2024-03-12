from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from contacts.models import Contact
from calendars.models import UserCalendars, NonBusyDate
from contacts.serializers import ContactSerializer
from calendars.serializers import NonBusyDateSerializer
from notify.models import Invitation

User = get_user_model()

class EventSchedulerView(APIView):
    permission_classes = [IsAuthenticated]

    def get_calendar_data(self, request):
        user = request.user

        # Get the user's contacts
        contacts = Contact.objects.filter(user=user)
        contacts_data = ContactSerializer(contacts, many=True).data

        # Initialize the data structure to hold user and guests' non-busy dates
        calendar_data = {
            'user': {
                'contacts': contacts_data,
                'non_busy_dates': []
            },
            'guests': []
        }

        # Get the user's non-busy dates
        user_calendars = UserCalendars.objects.filter(user=user)
        user_non_busy_dates = NonBusyDate.objects.filter(usercalendars__in=user_calendars)
        user_non_busy_dates_data = NonBusyDateSerializer(user_non_busy_dates, many=True).data
        calendar_data['user']['non_busy_dates'] = user_non_busy_dates_data

        # Get each contact's non-busy dates
        for contact in contacts:
            if contact.is_registered:
                # Look up the user instance associated with the contact email
                try:
                    registered_user = User.objects.get(email=contact.email)
                    invitations = Invitation.objects.filter(invited_user=registered_user)
                    non_busy_dates = NonBusyDate.objects.filter(invitation__in=invitations)
                except User.DoesNotExist:
                    continue  # Skip this contact if the user account doesn't exist
            else:
                # Handle the unregistered contacts by their ID or another method
                invitations = Invitation.objects.filter(calendar__usercalendars__user=contact.user, invited_user=None)
                non_busy_dates = NonBusyDate.objects.filter(invitation__in=invitations)
            
            non_busy_dates_data = NonBusyDateSerializer(non_busy_dates, many=True).data
            calendar_data['guests'].append({
                'contact_id': contact.id if not contact.is_registered else None,
                'user_id': registered_user.id if contact.is_registered else None,
                'non_busy_dates': non_busy_dates_data
            })

        return calendar_data

    def get(self, request, *args, **kwargs):
        calendar_data = self.get_calendar_data(request)
        return Response(calendar_data)

    # ... other methods ...
