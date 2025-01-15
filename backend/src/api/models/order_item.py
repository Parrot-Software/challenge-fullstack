from django.db import models
from .order import Order

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product_name = models.CharField(max_length=200)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product_name} - Order {self.order.id}"

    def save(self, *args, **kwargs):
        # Calculate total price before saving
        self.total_price = self.unit_price * self.quantity
        super().save(*args, **kwargs) 