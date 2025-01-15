import styled from '@emotion/styled';
import { useEffect } from 'react';

const AlertContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 1rem;
  background-color: #4CAF50;
  color: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  z-index: 1000;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Alert = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AlertContainer>
      <span>{message}</span>
      <CloseButton onClick={onClose}>×</CloseButton>
    </AlertContainer>
  );
};

export default Alert; 