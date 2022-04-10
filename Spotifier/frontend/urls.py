from django.urls import path
from . import views
from .views import index

app_name = 'frontend'

urlpatterns = [
    path('', index), 
    path('about', index),
    path('create-polaroid', index),
    path('polaroid/<str:polaroidID>', index),
]