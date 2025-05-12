# views.py
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.tokens import RefreshToken

from .models import (
    MenCologne,
    WomenCologne,
    Cart,
    CartItem,
    WomenCartItem,
)
from .serializers import (
    MenCologneSerializer,
    WomenCologneSerializer,
    RegisterSerializer,
    EmailLoginSerializer,
    CartSerializer,
    CartItemSerializer,
    WomenCartItemSerializer,
    WomenCartSerializer,
)

User = get_user_model()


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        domain = request.get_host()
        activation_link = f"http://{domain}/api/accounts/activate/{uidb64}/{token}/"

        subject = "Verify your Scent Society account"
        message = (
            f"Hi {user.username},\n\n"
            f"Please verify your email by clicking the link below:\n{activation_link}\n\n"
            "Thank you for joining Scent Society!"
        )
        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email], fail_silently=False)

        return Response({"message": "Verification email sent.", "activation_link": activation_link}, status=status.HTTP_201_CREATED)


class ActivateView(APIView):
    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user and default_token_generator.check_token(user, token):
            user.is_active = True
            user.save()
            return Response({"message": "Email verified. You can now log in."}, status=status.HTTP_200_OK)

        return Response({"error": "Invalid or expired activation link."}, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        serializer = EmailLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

        if not user.check_password(password):
            return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

        if not user.is_active:
            return Response({"error": "Please verify your email before logging in."}, status=status.HTTP_403_FORBIDDEN)

        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "email": user.email,
        }, status=status.HTTP_200_OK)


class MenCologneListView(APIView):
    def get(self, request):
        colognes = MenCologne.objects.all()
        serializer = MenCologneSerializer(colognes, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class MenCologneDetailView(APIView):
    def get(self, request, pk):
        try:
            cologne = MenCologne.objects.get(pk=pk)
            serializer = MenCologneSerializer(cologne, context={"request": request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except MenCologne.DoesNotExist:
            return Response({"error": "Cologne not found"}, status=status.HTTP_404_NOT_FOUND)


class WomenCologneListView(APIView):
    def get(self, request):
        colognes = WomenCologne.objects.all()
        serializer = WomenCologneSerializer(colognes, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class WomenCologneDetailView(APIView):
    def get(self, request, pk):
        try:
            cologne = WomenCologne.objects.get(pk=pk)
            serializer = WomenCologneSerializer(cologne, context={"request": request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except WomenCologne.DoesNotExist:
            return Response({"error": "Cologne not found"}, status=status.HTTP_404_NOT_FOUND)


class CartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart, context={"request": request})
        return Response(serializer.data)


class AddToCartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        cologne_id = request.data.get("cologne_id")
        quantity = int(request.data.get("quantity", 1))

        try:
            cologne = MenCologne.objects.get(id=cologne_id)
        except MenCologne.DoesNotExist:
            return Response({"error": "Cologne not found."}, status=status.HTTP_404_NOT_FOUND)

        cart, _ = Cart.objects.get_or_create(user=request.user)
        item, created = CartItem.objects.get_or_create(cart=cart, cologne=cologne)
        if not created:
            item.quantity += quantity
        else:
            item.quantity = quantity
        item.save()

        return Response({"message": "Item added to cart."}, status=status.HTTP_200_OK)


class UpdateCartItemView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, item_id):
        try:
            item = CartItem.objects.get(id=item_id, cart__user=request.user)
        except CartItem.DoesNotExist:
            return Response({"error": "Item not found in your cart."}, status=status.HTTP_404_NOT_FOUND)

        quantity = int(request.data.get("quantity", item.quantity))
        item.quantity = quantity
        item.save()

        return Response({"message": "Cart item updated."})


class RemoveCartItemView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, item_id):
        try:
            item = CartItem.objects.get(id=item_id, cart__user=request.user)
            item.delete()
            return Response({"message": "Item removed from cart."})
        except CartItem.DoesNotExist:
            return Response({"error": "Item not found in your cart."}, status=status.HTTP_404_NOT_FOUND)


class WomenCartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = WomenCartSerializer(cart, context={"request": request})
        return Response(serializer.data)


class AddWomenToCartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        cologne_id = request.data.get("cologne_id")
        quantity = int(request.data.get("quantity", 1))

        try:
            cologne = WomenCologne.objects.get(id=cologne_id)
        except WomenCologne.DoesNotExist:
            return Response({"error": "Cologne not found."}, status=status.HTTP_404_NOT_FOUND)

        cart, _ = Cart.objects.get_or_create(user=request.user)
        item, created = WomenCartItem.objects.get_or_create(
            cart=cart,
            cologne=cologne,
            defaults={"quantity": quantity}
        )
        if not created:
            item.quantity += quantity
        item.save()

        return Response({"message": "Item added to cart."}, status=status.HTTP_200_OK)


class UpdateWomenCartItemView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, item_id):
        try:
            item = WomenCartItem.objects.get(id=item_id, cart__user=request.user)
        except WomenCartItem.DoesNotExist:
            return Response({"error": "Item not found in your cart."}, status=status.HTTP_404_NOT_FOUND)

        quantity = int(request.data.get("quantity", item.quantity))
        item.quantity = quantity
        item.save()

        return Response({"message": "Cart item updated."})


class RemoveWomenCartItemView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, item_id):
        try:
            item = WomenCartItem.objects.get(id=item_id, cart__user=request.user)
            item.delete()
            return Response({"message": "Item removed from cart."})
        except WomenCartItem.DoesNotExist:
            return Response({"error": "Item not found in your cart."}, status=status.HTTP_404_NOT_FOUND)


# ✅ ADD-ONLY CheckoutView (Bottom)
class CheckoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            cart = Cart.objects.get(user=request.user)
        except Cart.DoesNotExist:
            return Response({"error": "Cart not found."}, status=status.HTTP_404_NOT_FOUND)

        cart.items.all().delete()
        cart.women_items.all().delete()

        return Response({"message": "Order processed. Cart cleared."}, status=status.HTTP_200_OK)
