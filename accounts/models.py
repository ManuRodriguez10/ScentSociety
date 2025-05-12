from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    email = models.EmailField(unique=True)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.username

class MenCologne(models.Model):
    SCENT_CHOICES = [
        ('fresh', 'Fresh'),
        ('citrus', 'Citrus'),
        ('night', 'Night'),
        ('spicy', 'Spicy'),
        ('sweet', 'Sweet'),
    ]

    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=6, decimal_places=2)
    original_price = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    image = models.ImageField(upload_to='colognes/')
    additional_images = models.JSONField(default=list, blank=True)
    scent_type = models.CharField(max_length=20, choices=SCENT_CHOICES)
    top_notes = models.JSONField(default=list, blank=True)
    rating = models.FloatField(default=4.5)

    def __str__(self):
        return self.name

class WomenCologne(models.Model):
    SCENT_CHOICES = [
        ('floral', 'Floral'),
        ('fresh', 'Fresh'),
        ('romantic', 'Romantic'),
        ('night', 'Night'),
    ]

    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=6, decimal_places=2, default=60.00)
    original_price = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    image = models.ImageField(upload_to='colognes/')
    additional_images = models.JSONField(default=list, blank=True)
    scent_type = models.CharField(max_length=20, choices=SCENT_CHOICES)
    top_notes = models.JSONField(default=list, blank=True)
    rating = models.FloatField(default=4.7)

    def __str__(self):
        return self.name

class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='cart')

    def __str__(self):
        return f"{self.user.username}'s Cart"

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    cologne = models.ForeignKey(MenCologne, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.cologne.name}"

class WomenCartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='women_items')
    cologne = models.ForeignKey(WomenCologne, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.cologne.name}"
