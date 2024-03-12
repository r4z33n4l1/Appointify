from rest_framework import serializers
from .models import Contact

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ['id', 'fname', 'lname', 'email', 'is_registered', 'user']

    def create(self, validated_data):
        contact = Contact.objects.create(**validated_data)
        return contact

    def update(self, instance, validated_data):
        instance.fname = validated_data.get('fname', instance.fname)
        instance.lname = validated_data.get('lname', instance.lname)
        instance.email = validated_data.get('email', instance.email)
        instance.is_registered = validated_data.get('is_registered', instance.is_registered)
        instance.save()
        return instance
