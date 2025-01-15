from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login, name='login'),
    path('orders/', views.create_order, name='create_order'),
    path('orders/recent/', views.get_recent_orders, name='recent_orders'),
] 