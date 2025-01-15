from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from .serializers.user_serializer import UserSerializer
from .serializers.order_serializer import OrderCreateSerializer, OrderDetailSerializer
from .models.order import Order
from rest_framework.pagination import PageNumberPagination

@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response(
            {'error': 'Please provide both username and password'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(username=username, password=password)

    if user is None:
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    # Generate token
    refresh = RefreshToken.for_user(user)
    
    # Serialize user data
    serializer = UserSerializer(user)

    return Response({
        'user': serializer.data,
        'tokens': {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }
    }) 

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    serializer = OrderCreateSerializer(data=request.data)
    if serializer.is_valid():
        order = serializer.save()
        return Response(
            OrderDetailSerializer(order).data,
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 

class OrderPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 100

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_recent_orders(request):
    orders = Order.objects.all().order_by('-created_at')
    paginator = OrderPagination()
    paginated_orders = paginator.paginate_queryset(orders, request)
    serializer = OrderDetailSerializer(paginated_orders, many=True)
    return paginator.get_paginated_response(serializer.data) 