from django.urls import path
from .views import PolaroidView

urlpatterns = [
    path('polaroid', PolaroidView.as_view()),
]