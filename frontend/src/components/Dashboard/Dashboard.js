import styled from '@emotion/styled';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../common/Card';
import Input from '../common/Input';
import Divider from '../common/Divider';
import Alert from '../common/Alert';
import axios from 'axios';
import RecentOrders from './RecentOrders';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  min-height: calc(100vh - 140px);
  background-color: #f5f5f5;
  padding: 2rem;
`;

const WelcomeSection = styled.div`
  width: 100%;
`;

const CardContent = styled.div`
  display: flex;
  align-items: center;
  min-height: 80px;
`;

const Welcome = styled.h2`
  color: #47465f;
  font-size: 1.8rem;
  margin: 0;
`;

const FormTitle = styled.h3`
  color: #47465f;
  font-size: 1.5rem;
  margin: 0;
`;

const SubTitle = styled.h4`
  color: #47465f;
  font-size: 1.2rem;
  margin: 1.5rem 0;
`;

const ProductRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px 120px 40px 40px;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
`;

const AddButton = styled.button`
  background: none;
  border: none;
  color: #4CAF50;
  font-size: 24px;
  cursor: pointer;
  width: 28px;
  height: 28px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #45a049;
  }
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #f65954;
  font-size: 24px;
  cursor: pointer;
  width: 28px;
  height: 28px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #e54944;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 2rem;
`;

const SubmitButton = styled.button`
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 1rem 2rem;
  font-size: 1rem;
  cursor: pointer;
  
  &:hover {
    background-color: #45a049;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #f65954;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.isCollapsed ? '0' : '2rem'};
`;

const CollapseButton = styled.button`
  background: #47465f;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  
  &:hover {
    background: #f65954;
  }
`;

const FormContent = styled.div`
  display: ${props => props.isVisible ? 'block' : 'none'};
`;

const Dashboard = () => {
  const { auth } = useAuth();
  const fullName = `${auth.user.first_name || ''} ${auth.user.last_name || ''}`.trim() || auth.user.username;
  const [products, setProducts] = useState([{ name: '', quantity: '', price: '' }]);
  const [customerName, setCustomerName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [refreshOrders, setRefreshOrders] = useState(0);
  const [isFormVisible, setIsFormVisible] = useState(true);

  const handleAddProduct = () => {
    setProducts([...products, { name: '', quantity: '', price: '' }]);
  };

  const handleProductChange = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index][field] = value;
    setProducts(newProducts);
  };

  const handleDeleteProduct = (indexToDelete) => {
    setProducts(products.filter((_, index) => index !== indexToDelete));
  };

  const validateForm = () => {
    if (!customerName.trim()) {
      setError('Please enter customer name');
      return false;
    }

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      if (!product.name.trim() || !product.quantity || !product.price) {
        setError(`Please fill all fields for product ${i + 1}`);
        return false;
      }
    }

    setError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/orders/`,
        {
          customer_name: customerName,
          products: products.map(product => ({
            product_name: product.name,
            quantity: parseInt(product.quantity),
            unit_price: parseFloat(product.price)
          }))
        },
        {
          headers: {
            'Authorization': `Bearer ${auth.tokens.access}`
          }
        }
      );

      setCustomerName('');
      setProducts([{ name: '', quantity: '', price: '' }]);
      setError('');
      setShowSuccessAlert(true);
      setRefreshOrders(prev => prev + 1);
      
      console.log('Order created:', response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardContainer>
      {showSuccessAlert && (
        <Alert 
          message="Order created successfully!" 
          onClose={() => setShowSuccessAlert(false)}
        />
      )}
      <WelcomeSection>
        <Card>
          <CardContent>
            <Welcome>Welcome, {fullName}!</Welcome>
          </CardContent>
        </Card>
      </WelcomeSection>

      <WelcomeSection>
        <Card>
          <FormHeader isCollapsed={!isFormVisible}>
            <FormTitle>Create a new order</FormTitle>
            <CollapseButton onClick={() => setIsFormVisible(!isFormVisible)}>
              {isFormVisible ? 'Hide' : 'Show'}
            </CollapseButton>
          </FormHeader>
          
          <FormContent isVisible={isFormVisible}>
            <Input 
              placeholder="Customer name"
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            
            <Divider />
            
            <SubTitle>Products</SubTitle>
            
            {products.map((product, index) => (
              <ProductRow key={index}>
                <Input
                  placeholder="Product name"
                  value={product.name}
                  onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                />
                <Input
                  placeholder="Quantity"
                  type="number"
                  value={product.quantity}
                  onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                />
                <Input
                  placeholder="Price"
                  type="number"
                  step="0.01"
                  value={product.price}
                  onChange={(e) => handleProductChange(index, 'price', e.target.value)}
                />
                {index !== 0 && (
                  <DeleteButton onClick={() => handleDeleteProduct(index)}>
                    <span>-</span>
                  </DeleteButton>
                )}
                {index === products.length - 1 && (
                  <AddButton onClick={handleAddProduct}>
                    <span>+</span>
                  </AddButton>
                )}
              </ProductRow>
            ))}

            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <ButtonContainer>
              <SubmitButton 
                onClick={handleSubmit} 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating Order...' : 'Create Order'}
              </SubmitButton>
            </ButtonContainer>
          </FormContent>
        </Card>
      </WelcomeSection>

      <WelcomeSection>
        <RecentOrders refreshTrigger={refreshOrders} />
      </WelcomeSection>
    </DashboardContainer>
  );
};

export default Dashboard; 