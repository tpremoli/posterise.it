from rest_framework import serializers
from .models import Polaroid


class PolaroidSerializer(serializers.ModelSerializer):
    class Meta:
        model = Polaroid
        fields = ('id', 'creator', 'uri', 'name', 'is_album',
                  'artist', 'length')

class CreatePolaroidSerializer(serializers.ModelSerializer):
    class Meta:
        model = Polaroid
        fields = ('creator','uri','is_album')
