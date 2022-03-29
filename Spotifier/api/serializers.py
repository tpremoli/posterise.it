from rest_framework import serializers
from .models import Polaroid


class PolaroidSerializer(serializers.ModelSerializer):
    class Meta:
        model = Polaroid
        fields = ('id', 'track_uri', 'track_name',
                  'track_artist', 'track_length')
