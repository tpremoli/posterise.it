from django.urls import path
from . import views
from .views import AuthURL, is_authenticated, spotify_callback

urlpatterns = [
    # path('', index),
#     path('', index),
#     path('login/', AuthURL.as_view(), name='login'),
#     path('redirect/', spotify_callback, name='redirect'),
#     path('is-authenticated/', is_authenticated.as_view(), name='is_authenticated'),
]