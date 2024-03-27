from django.urls import path
from .views import EventSchedulerView, AvailabilityDataView

urlpatterns = [
    path('create_event/', EventSchedulerView.as_view(), name='create_event'),
    path('availability_data/', AvailabilityDataView.as_view(), name='availability_data'),
]
