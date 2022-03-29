from django.urls import path
from .views import CreatePolaroid

urlpatterns = [
    path('create-polaroid', CreatePolaroid.as_view()),
]