from rest_framework import serializers
from .models import Polaroid


class PolaroidSerializer(serializers.ModelSerializer):
    class Meta:
        model = Polaroid
        fields = ('id', 'creator', 'track_uri', 'track_name',
                  'track_artist', 'track_length')

class CreatePolaroidSerializer(serializers.ModelSerializer):
    class Meta:
        model = Polaroid
        fields = ('creator','track_uri')
