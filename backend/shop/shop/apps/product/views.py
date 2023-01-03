from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import render, get_object_or_404

from .models import Product
from .serializers import ProductSerializer


# for Django Template Language
def product_detail(request, slug):
    product = get_object_or_404(Product, slug=slug)
    context = {'product': product}
    return render(request, 'product/product_detail.html', context)


# for Django Rest Framework
class LatestProductsList(APIView):

    def get(self, request, format=None):
        products = Product.objects.all()[0:6]
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
