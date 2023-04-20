import { useRef } from 'react';
import {
  ContentLayout,
  Alert,
  Header,
  Button,
  Box,
  Container,
} from '@cloudscape-design/components';
import { useNavigate } from 'react-router-dom';
import { FrontendSharedComponentsAppLayout } from '@visionarea-admin/frontend/shared/components/app-layout';

export function NotFound() {
  const appLayout = useRef();
  const navigate = useNavigate();
  return (
    <FrontendSharedComponentsAppLayout
      ref={appLayout}
      contentType="default"
      content={
        <ContentLayout header={<Header variant="h1">visionarea</Header>}>
          <Box margin="xxl" padding="xxl">
            <Container header={<Header variant="h2">Error</Header>}>
              <Alert
                dismissAriaLabel="Close alert"
                type="error"
                header="Page was not found"
                action={
                  <Button variant="primary" onClick={() => navigate('/')}>
                    Go Home Page
                  </Button>
                }
              >
                Something went wrong. The page you are looking for does not
                exist.
              </Alert>
            </Container>
          </Box>
        </ContentLayout>
      }
      headerSelector="#header"
      toolsHide
      navigationHide
    />
  );
}
