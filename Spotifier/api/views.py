from django.shortcuts import render
from matplotlib.pyplot import polar
from rest_framework import generics
from .models import Polaroid
from .serializers import PolaroidSerializer, CreatePolaroidSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import datetime
# Create your views here.


class PolaroidView(generics.ListAPIView):
    queryset = Polaroid.objects.all()
    serializer_class = PolaroidSerializer

class CreatePolaroidView(APIView):
    serializer_class = CreatePolaroidSerializer;

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():

            creator = self.request.session.session_key
            track_uri = serializer.data.get("track_uri")
            time = datetime.time(minute=3,second=5)

            polaroid = Polaroid(creator=creator, track_uri=track_uri, track_length=time)
            
            polaroid.save()
        
            return Response(PolaroidSerializer(polaroid).data, status=status.HTTP_200_OK)
