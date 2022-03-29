from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('', include('frontend.urls')),
    path('polaroidizer', include('polaroidizer.urls')),
    path('admin/', admin.site.urls),
]