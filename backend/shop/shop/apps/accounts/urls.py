from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('activate/<uidb64>/<token>/', views.activate, name='activate'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('', views.dashboard, name='dashboard'),
    path('forgot_password/', views.forgotPassword, name='forgotPassword'),
    path('reset_password_validate/<uidb64>/<token>/',
         views.resetpassword_validate,
         name='resetpassword_validate'),
    path('reset_password/', views.resetPassword, name='resetPassword'),
    path('change_password/', views.change_password, name='change_password'),
]
