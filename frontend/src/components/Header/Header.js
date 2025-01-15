import styled from '@emotion/styled';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const HeaderContainer = styled.header`
  background-color: #47465f;
  padding: 1rem;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.h1`
  color: #f65954;
  margin: 0;
  font-size: 2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const HeaderButton = styled.button`
  background: transparent;
  border: 1px solid #f65954;
  color: #f65954;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: #f65954;
    color: white;
  }
`;

const Header = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isReportPage = location.pathname === '/report';

  return (
    <HeaderContainer>
      <Logo>Parrot</Logo>
      {auth && (
        <ButtonGroup>
          {!isReportPage && (
            <HeaderButton onClick={() => navigate('/report')}>Report</HeaderButton>
          )}
          <HeaderButton onClick={logout}>Logout</HeaderButton>
        </ButtonGroup>
      )}
    </HeaderContainer>
  );
};

export default Header; 