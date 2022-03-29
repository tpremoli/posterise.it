from django.db import models

# Create your models here.
class Polaroid(models.Model):
    creator = models.CharField(max_length=50)
    track_uri = models.CharField(max_length=50, unique=True)
    track_name = models.CharField(max_length=50)
    track_artist = models.CharField(max_length=50)
    track_length = models.TimeField()