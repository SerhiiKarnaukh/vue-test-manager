from rest_framework.views import APIView
from rest_framework.response import Response
# from django.shortcuts import render, get_object_or_404
from django.views.generic import DetailView

from .models import Product, Category
from .serializers import ProductSerializer


# for Django Template Language
class ProductDetail(DetailView):
    model = Product
    template_name = 'product/product_detail.html'
    context_object_name = 'product'

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)
        return context


class CategoryDetail(DetailView):
    model = Category
    template_name = 'product/category_detail.html'
    context_object_name = 'products'
    allow_empty = False

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)
        context['products'] = Product.objects.filter(
            category__slug=self.kwargs['slug']).select_related('category')
        return context


# for Django Rest Framework
class LatestProductsList(APIView):

    def get(self, request, format=None):
        products = Product.objects.all()[0:6]
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
