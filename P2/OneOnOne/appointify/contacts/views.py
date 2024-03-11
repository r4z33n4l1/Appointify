from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Contact
from .serializers import ContactSerializer
from rest_framework.permissions import IsAuthenticated

class ContactListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        contacts = Contact.objects.filter(user=request.user)
        serializer = ContactSerializer(contacts, many=True)
        return Response(serializer.data)

class ContactDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk, *args, **kwargs):
        contact = Contact.objects.get(pk=pk, user=request.user)
        serializer = ContactSerializer(contact)
        return Response(serializer.data)

    def put(self, request, pk, *args, **kwargs):
        contact = Contact.objects.get(pk=pk, user=request.user)
        serializer = ContactSerializer(contact, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, *args, **kwargs):
        contact = Contact.objects.get(pk=pk, user=request.user)
        contact.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
