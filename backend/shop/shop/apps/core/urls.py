from django.urls import path

from core.views import contact
from product.views import ProductDetail, CategoryDetail

urlpatterns = [
    path('contact/', contact, name='contact'),
    path('<slug:slug>/', CategoryDetail.as_view(), name='category_detail'),
    path('<slug:category_slug>/<slug:slug>/',
         ProductDetail.as_view(),
         name='product_detail'),
]
