from django.shortcuts import render
from django.views.generic import ListView

from product.models import Product


class FrontPage(ListView):
    model = Product
    template_name = 'core/frontpage.html'
    context_object_name = 'products'

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)
        return context

    def get_queryset(self):
        return Product.objects.all().filter(
            is_available=True).select_related('category')


def contact(request):
    return render(request, 'core/contact.html')


def about(request):
    return render(request, 'core/about.html')
