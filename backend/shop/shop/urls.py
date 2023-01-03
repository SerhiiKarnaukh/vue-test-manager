from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from core.views import FrontPage, contact
from product.views import ProductDetail, CategoryDetail

urlpatterns = [
    path('admin/', admin.site.urls),

    # for Django Rest Framework
    path('api/v1/', include('djoser.urls')),
    path('api/v1/', include('djoser.urls.authtoken')),
    path('api/v1/', include('product.urls')),

    # for Django Template Language
    path('', FrontPage.as_view(), name='frontpage'),
    path('contact/', contact, name='contact'),
    path('<slug:category_slug>/<slug:slug>/',
         ProductDetail.as_view(),
         name='product_detail'),
    path('<slug:slug>/', CategoryDetail.as_view(), name='category_detail'),
]

if settings.DEBUG:
    import debug_toolbar

    urlpatterns = [
        path('__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns

    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
