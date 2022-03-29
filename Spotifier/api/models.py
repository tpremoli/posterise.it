from django.db import models

# Create your models here.
class Polaroid(models.Model):
    creator = models.CharField(max_length=50)
    is_album = models.BooleanField(default=False)

    uri = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=50)
    artist = models.CharField(max_length=50)
    length = models.TimeField()