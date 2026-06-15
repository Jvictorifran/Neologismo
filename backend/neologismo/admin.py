from django.contrib import admin
from .models import Neologismo, Contexto


class ContextoInline(admin.TabularInline):
    model = Contexto
    extra = 1


@admin.register(Neologismo)
class NeologismoAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'classe_gramatical', 'status', 'autor', 'data_criacao')
    list_filter = ('status', 'classe_gramatical')
    search_fields = ('titulo', 'definicao')
    inlines = [ContextoInline]


admin.site.register(Contexto)
