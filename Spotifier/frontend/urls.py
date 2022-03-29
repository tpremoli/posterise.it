from django.urls import path
from . import views
from .views import index

urlpatterns = [
    path('', index), 
    path('about', index),
    path('create-polaroid', index),
#     path('redirect/', spotify_callback, name='redirect'),
#     path('is-authenticated/', is_authenticated.as_view(), name='is_authenticated'),
]