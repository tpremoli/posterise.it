from __future__ import print_function
from django.shortcuts import render
import random
import spotipy


def home(request):
    context = {}
    return render(request, 'home.html', context)


def login(request):
    context = {}
    return render(request, 'login.html', context)
