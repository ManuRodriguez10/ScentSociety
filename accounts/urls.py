from django.urls import path
from .views import (
    RegisterView,
    ActivateView,
    LoginView,
    MenCologneListView,
    MenCologneDetailView,
    WomenCologneListView,
    WomenCologneDetailView,
    CartView,
    AddToCartView,
    UpdateCartItemView,
    RemoveCartItemView,
    WomenCartView,
    AddWomenToCartView,
    UpdateWomenCartItemView,
    RemoveWomenCartItemView,
    CheckoutView,  # ✅ Safe Add
)

urlpatterns = [
    # Auth
    path('register/', RegisterView.as_view(), name='register'),
    path('activate/<str:uidb64>/<str:token>/', ActivateView.as_view(), name='activate'),
    path('login/', LoginView.as_view(), name='login'),

    # Cologne
    path('menscolognes/', MenCologneListView.as_view(), name='men-cologne-list'),
    path('menscolognes/<int:pk>/', MenCologneDetailView.as_view(), name='men-cologne-detail'),
    path('womenscolognes/', WomenCologneListView.as_view(), name='women-cologne-list'),
    path('womenscolognes/<int:pk>/', WomenCologneDetailView.as_view(), name='women-cologne-detail'),

    # Men’s Cart
    path('cart/', CartView.as_view(), name='cart'),
    path('cart/add/', AddToCartView.as_view(), name='add-to-cart'),
    path('cart/update/<int:item_id>/', UpdateCartItemView.as_view(), name='update-cart-item'),
    path('cart/remove/<int:item_id>/', RemoveCartItemView.as_view(), name='remove-cart-item'),

    # Women’s Cart
    path('women-cart/', WomenCartView.as_view(), name='women-cart'),
    path('women-cart/add/', AddWomenToCartView.as_view(), name='add-women-to-cart'),
    path('women-cart/update/<int:item_id>/', UpdateWomenCartItemView.as_view(), name='update-women-cart-item'),
    path('women-cart/remove/<int:item_id>/', RemoveWomenCartItemView.as_view(), name='remove-women-cart-item'),

    # ✅ Checkout
    path('checkout/', CheckoutView.as_view(), name='checkout'),
]
