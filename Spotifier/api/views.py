from django.shortcuts import render
from rest_framework import generics
from .models import Polaroid
from .serializers import PolaroidSerializer

# Create your views here.


class PolaroidView(generics.ListAPIView):
    queryset = Polaroid.objects.all()
    serializer_class = PolaroidSerializer