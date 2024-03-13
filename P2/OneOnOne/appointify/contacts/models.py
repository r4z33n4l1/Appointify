from django.db import models
from django.conf import settings
# Create your models here.
# import Django's built-in User model
from django.contrib.auth.models import User


class Contact(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='contacts')
    fname = models.CharField(max_length=50, verbose_name='First Name')
    lname = models.CharField(max_length=50, verbose_name='Last Name')
    email = models.EmailField(unique=True, verbose_name='Email')

    def __str__(self):
        return f"{self.fname} {self.lname}"
