from django.shortcuts import render

from product.models import Product


def frontpage(request):
    products = Product.objects.all()

    context = {'products': products}
    return render(request, 'core/frontpage.html', context)


def contact(request):
    return render(request, 'core/contact.html')
