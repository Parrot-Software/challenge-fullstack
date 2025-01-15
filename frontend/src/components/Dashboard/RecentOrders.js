import React from 'react';
import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../common/Card';
import { useAuth } from '../../context/AuthContext';

const OrdersTitle = styled.h3`
  color: #47465f;
  font-size: 1.5rem;
  margin: 0 0 1.5rem 0;
`;

const OrdersTable = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto 1fr;
  gap: 1rem;
  font-size: 0.9rem;
`;

const HeaderCell = styled.div`
  color: #47465f;
  font-weight: bold;
  padding: 0.5rem 0;
  border-bottom: 2px solid #47465f;
`;

const Cell = styled.div`
  padding: 1rem 0;
  border-bottom: 1px solid #ddd;
`;

const ProductsList = styled.div`
  white-space: pre-line;
  color: #666;
`;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

const formatProducts = (items) => {
  return items.map(item => 
    `${item.product_name} (${item.quantity} x $${item.unit_price})`
  ).join('\n');
};

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const PageButton = styled.button`
  background: ${props => props.active ? '#4CAF50' : 'white'};
  color: ${props => props.active ? 'white' : '#47465f'};
  border: 1px solid #4CAF50;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  
  &:hover {
    background: ${props => props.active ? '#4CAF50' : '#f0f0f0'};
  }
  
  &:disabled {
    background: #f0f0f0;
    border-color: #ddd;
    color: #999;
    cursor: not-allowed;
  }
`;

const PageInfo = styled.span`
  color: #47465f;
  font-size: 0.9rem;
`;

const RecentOrders = ({ refreshTrigger }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { auth } = useAuth();

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when refreshTrigger changes
  }, [refreshTrigger]);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/orders/recent/?page=${currentPage}`,
          {
            headers: {
              'Authorization': `Bearer ${auth.tokens.access}`
            }
          }
        );
        setOrders(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 5));
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [auth.tokens.access, refreshTrigger, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <OrdersTitle>Recent Orders</OrdersTitle>
      <OrdersTable>
        <HeaderCell>Date</HeaderCell>
        <HeaderCell>Customer</HeaderCell>
        <HeaderCell>Total</HeaderCell>
        <HeaderCell>Products</HeaderCell>
        
        {orders.map(order => (
          <React.Fragment key={order.id}>
            <Cell>{formatDate(order.created_at)}</Cell>
            <Cell>{order.customer_name}</Cell>
            <Cell>${order.total_amount}</Cell>
            <Cell>
              <ProductsList>
                {formatProducts(order.items)}
              </ProductsList>
            </Cell>
          </React.Fragment>
        ))}
      </OrdersTable>

      <PaginationContainer>
        <PageButton
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </PageButton>

        <PageInfo>
          Page {currentPage} of {totalPages}
        </PageInfo>

        <PageButton
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </PageButton>
      </PaginationContainer>
    </Card>
  );
};

export default RecentOrders; 