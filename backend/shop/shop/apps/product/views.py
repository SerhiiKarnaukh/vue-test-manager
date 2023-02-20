from rest_framework import generics
from django.views.generic import ListView, DetailView
from django.shortcuts import render
from django.db.models import Q

from .models import Product, Category
from .serializers import ProductSerializer
from cart.models import CartItem
from cart.views import _get_cart_id


# for Django Template Language
class ProductDetail(DetailView):
    model = Product
    template_name = 'product/product_detail.html'
    context_object_name = 'product'

    def create_store_data(self, **kwargs):
        context = kwargs
        context['in_cart'] = CartItem.objects.filter(
            cart__cart_id=_get_cart_id(self.request),
            product__slug=self.kwargs['slug']).exists()
        return context

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)
        c_def = self.create_store_data()
        return dict(list(context.items()) + list(c_def.items()))


class CategoryDetail(ListView):
    paginate_by = 4
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


def search(request):
    if 'keyword' in request.GET:
        keyword = request.GET['keyword']
        if keyword:
            products = Product.objects.order_by('-date_added').filter(
                Q(description__icontains=keyword)
                | Q(name__icontains=keyword))
            product_count = products.count()
    context = {
        'products': products,
        'product_count': product_count,
    }
    return render(request, 'product/store.html', context)


# for Django Rest Framework
class LatestProductsList(generics.ListAPIView):
    queryset = Product.objects.all().filter(is_available=True)[0:6]
    serializer_class = ProductSerializer


class ProductAPIDetail(generics.RetrieveUpdateDestroyAPIView):
    lookup_url_kwarg = 'product_slug'
    lookup_field = 'slug'
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
