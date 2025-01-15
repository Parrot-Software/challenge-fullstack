from rest_framework import serializers
from ..models.order import Order
from ..models.order_item import OrderItem
from .order_item_serializer import OrderItemSerializer, OrderItemDetailSerializer

class OrderCreateSerializer(serializers.Serializer):
    customer_name = serializers.CharField(max_length=200)
    products = OrderItemSerializer(many=True)

    def create(self, validated_data):
        products = validated_data.pop('products')
        
        # Calculate total amount
        total_amount = sum(
            item['unit_price'] * item['quantity']
            for item in products
        )
        
        # Create order
        order = Order.objects.create(
            customer_name=validated_data['customer_name'],
            total_amount=total_amount
        )
        
        # Create order items
        for product in products:
            OrderItem.objects.create(
                order=order,
                product_name=product['product_name'],
                unit_price=product['unit_price'],
                quantity=product['quantity']
            )
        
        return order

class OrderDetailSerializer(serializers.ModelSerializer):
    items = OrderItemDetailSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'customer_name', 'total_amount', 'created_at', 'items'] 