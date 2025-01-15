import styled from '@emotion/styled';

const FooterContainer = styled.footer`
  background-color: #47465f;
  color: white;
  padding: 1rem;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
`;

const Link = styled.a`
  color: #f65954;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <Link href="/terms">Terms of Service</Link>
    </FooterContainer>
  );
};

export default Footer; 