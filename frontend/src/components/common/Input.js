import styled from '@emotion/styled';

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  width: ${props => props.width || '100%'};
  
  &:focus {
    outline: none;
    border-color: #f65954;
  }
`;

export default Input; 