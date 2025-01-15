import styled from '@emotion/styled';
import Card from '../common/Card';

const ReportContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  min-height: calc(100vh - 140px);
  background-color: #f5f5f5;
  padding: 2rem;
`;

const ReportSection = styled.div`
  width: 100%;
`;

const ReportTitle = styled.h3`
  color: #47465f;
  font-size: 1.5rem;
  margin: 0 0 1.5rem 0;
`;

const Report = () => {
  return (
    <ReportContainer>
      <ReportSection>
        <Card>
          <ReportTitle>TODO</ReportTitle>
        </Card>
      </ReportSection>
    </ReportContainer>
  );
};

export default Report; 