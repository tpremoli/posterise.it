from django.urls import path
from .views import PolaroidView, CreatePolaroidView

urlpatterns = [
    path('polaroid', PolaroidView.as_view()),
    path('create-polaroid', CreatePolaroidView.as_view()),
]