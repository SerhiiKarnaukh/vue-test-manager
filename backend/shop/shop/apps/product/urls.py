from django.urls import path, include

from product import views

urlpatterns = [
    path('', include('djoser.urls')),
    path('', include('djoser.urls.authtoken')),
    path('latest-products/', views.LatestProductsList.as_view()),
]
