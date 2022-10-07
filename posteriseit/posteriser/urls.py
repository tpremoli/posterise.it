from django.urls import path
from .views import AuthURL, spotify_callback, IsAuthenticated, Posterise

urlpatterns = [
    path('api/get-auth-url', AuthURL.as_view()),
    path('redirect', spotify_callback),
    path('api/is-authenticated', IsAuthenticated.as_view()),
    path('api/posterise/', Posterise.as_view())
]