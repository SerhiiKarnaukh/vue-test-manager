from django.contrib import admin

from .models import Category, Product


class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'ordering')
    list_display_links = ('id', 'name')
    search_fields = ('name', )
    list_editable = ('ordering', )
    prepopulated_fields = {"slug": ("name", )}


class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'is_available', 'stock', 'date_added',
                    'image')
    list_display_links = ('id', 'name')
    search_fields = ('name', 'description')
    list_editable = ('is_available', 'stock')
    list_filter = ('is_available', 'date_added')
    prepopulated_fields = {"slug": ("name", )}


admin.site.register(Category, CategoryAdmin)
admin.site.register(Product, ProductAdmin)
