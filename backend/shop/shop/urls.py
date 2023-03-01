from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from core.views import FrontPage

urlpatterns = [
    path('grappelli/', include('grappelli.urls')),
    path('admin/', admin.site.urls),

    # for Django Rest Framework
    path('api/v1/', include('product.urls')),

    # for Django Template Language
    path('cart/', include('cart.urls')),
    path('', FrontPage.as_view(), name='frontpage'),
    path('store/', include('core.urls')),
    path('accounts/', include('accounts.urls')),
]

if settings.DEBUG:
    import debug_toolbar

    urlpatterns = [
        path('__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns

    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
