from django.urls import path
from . import views

urlpatterns = [
    path('nearby/', views.get_places, name='get_places'),
]