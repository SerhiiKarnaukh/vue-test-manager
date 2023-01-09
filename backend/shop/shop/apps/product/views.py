from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import Http404
from django.views.generic import ListView, DetailView

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


class CategoryDetail(ListView):
    model = Product
    template_name = 'product/store.html'
    context_object_name = 'products'
    allow_empty = False

    def create_store_data(self, **kwargs):
        context = kwargs
        if 'slug' in self.kwargs:
            context['store_title'] = Category.objects.get(
                slug=self.kwargs['slug'])
            context['product_count'] = Product.objects.filter(
                category__slug=self.kwargs['slug'], is_available=True).count()
            return context
        else:
            context['store_title'] = 'All products'
            context['product_count'] = Product.objects.all().filter(
                is_available=True).count()
            return context

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)
        c_def = self.create_store_data()
        return dict(list(context.items()) + list(c_def.items()))

    def get_queryset(self, **kwargs):
        if 'slug' in self.kwargs:
            return Product.objects.filter(
                category__slug=self.kwargs['slug'],
                is_available=True).select_related('category')
        else:
            return Product.objects.all().filter(
                is_available=True).select_related('category')


# for Django Rest Framework
class LatestProductsList(APIView):

    def get(self, request, format=None):
        products = Product.objects.all()[0:6]
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)


class ProductAPIDetail(APIView):

    def get_object(self, category_slug, product_slug):
        try:
            return Product.objects.filter(category__slug=category_slug).get(
                slug=product_slug)
        except Product.DoesNotExist:
            raise Http404

    def get(self, request, category_slug, product_slug, format=None):
        product = self.get_object(category_slug, product_slug)
        serializer = ProductSerializer(product)
        return Response(serializer.data)
