from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import MenCologne, WomenCologne, Cart, CartItem, WomenCartItem

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
            is_active=False
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class EmailLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

class MenCologneSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    additional_images = serializers.SerializerMethodField()

    class Meta:
        model = MenCologne
        fields = '__all__'

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        elif obj.image:
            return obj.image.url
        return None

    def get_additional_images(self, obj):
        request = self.context.get('request')
        images = obj.additional_images
        if not images:
            return []
        if request:
            return [request.build_absolute_uri(img) for img in images]
        else:
            return images

class WomenCologneSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    additional_images = serializers.SerializerMethodField()

    class Meta:
        model = WomenCologne
        fields = '__all__'

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        elif obj.image:
            return obj.image.url
        return None

    def get_additional_images(self, obj):
        request = self.context.get('request')
        images = obj.additional_images
        if not images:
            return []
        if request:
            return [request.build_absolute_uri(img) for img in images]
        else:
            return images

class CartItemSerializer(serializers.ModelSerializer):
    cologne = MenCologneSerializer()

    class Meta:
        model = CartItem
        fields = ['id', 'cologne', 'quantity']

class WomenCartItemSerializer(serializers.ModelSerializer):
    cologne = WomenCologneSerializer()

    class Meta:
        model = WomenCartItem
        fields = ['id', 'cologne', 'quantity']

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True)
    women_items = WomenCartItemSerializer(many=True)

    class Meta:
        model = Cart
        fields = ['id', 'items', 'women_items']

class WomenCartSerializer(serializers.ModelSerializer):
    women_items = WomenCartItemSerializer(many=True)

    class Meta:
        model = Cart
        fields = ['id', 'women_items']
