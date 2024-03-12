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


class ContactCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = ContactSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ContactDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Contact.objects.get(pk=pk, user=self.request.user)
        except Contact.DoesNotExist:
            return None

    def get(self, request, pk, *args, **kwargs):
        contact = self.get_object(pk)
        if contact is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = ContactSerializer(contact)
        return Response(serializer.data)

    def put(self, request, pk, *args, **kwargs):
        contact = self.get_object(pk)
        if contact is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = ContactSerializer(contact, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, *args, **kwargs):
        contact = self.get_object(pk)
        if contact is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        contact.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
