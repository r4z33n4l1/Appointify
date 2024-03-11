from django.urls import path
from .views import ContactListView, ContactDetailView

urlpatterns = [
    path('contacts/', ContactListView.as_view(), name='contact_list'),
    path('contacts/<int:pk>/', ContactDetailView.as_view(), name='contact_detail'),
]
