from django.urls import path
from .views import ContactListView, ContactDetailView

urlpatterns = [
    path('all/', ContactListView.as_view(), name='contact_list'),
    path('view/<int:pk>/', ContactDetailView.as_view(), name='contact_detail'),
]
