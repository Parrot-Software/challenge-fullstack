import styled from '@emotion/styled';

const CardContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Card = ({ children }) => {
  return <CardContainer>{children}</CardContainer>;
};

export default Card; 