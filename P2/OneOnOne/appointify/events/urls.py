from django.urls import path
from . import views

urlpatterns = [
    path('create_event/', views.EventSchedulerView.as_view(), name='create_event'),
]