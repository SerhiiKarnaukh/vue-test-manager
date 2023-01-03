from django.contrib import admin

from .models import Category, Product


class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    list_display_links = ('id', 'name')
    search_fields = ('name', )
    prepopulated_fields = {"slug": ("name", )}


class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'date_added', 'image')
    list_display_links = ('id', 'name')
    search_fields = ('name', 'description')
    # list_editable = ('is_published', )
    # list_filter = ('is_published', 'time_create')
    prepopulated_fields = {"slug": ("name", )}


admin.site.register(Category, CategoryAdmin)
admin.site.register(Product, ProductAdmin)
