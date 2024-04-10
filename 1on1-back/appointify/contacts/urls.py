from django.urls import path
from .views import ContactListView, ContactDetailView, ContactCreateView

urlpatterns = [
    path('all/', ContactListView.as_view(), name='contact_list'),
    path('view/<int:pk>/', ContactDetailView.as_view(), name='contact_detail'),
    path('add/', ContactCreateView.as_view(), name='contact_create')
]
