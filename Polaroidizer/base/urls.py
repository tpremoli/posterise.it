from django.conf import settings
from django.conf.urls.static import static
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.urls import path, include
from django.contrib import admin
from . import views

urlpatterns = [
    path('', views.home, name="home"),
    path('', include('base.urls')),
]

# Need to change this before final deployment as django recommends to do this another way
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += staticfiles_urlpatterns()
