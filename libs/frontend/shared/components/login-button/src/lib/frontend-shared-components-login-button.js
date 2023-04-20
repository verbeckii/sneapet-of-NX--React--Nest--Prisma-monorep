import { useAuth0 } from '@auth0/auth0-react';
import { getImagePath } from '@visionarea-admin/frontend/shared/function';
import { Row, Col, Container, Button } from 'reactstrap';

export const FrontendSharedComponentsLoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <Container className="vh-100 justify-content-center align-items-center">
      <Row
        className="h-75 justify-content-center align-items-center"
        xs="1"
        sm="3"
        md="4"
      >
        <Col
          xs="12"
          sm="12"
          md="12"
          className="d-flex flex-column justify-content-center align-items-center"
        >
          <img
            className="logo"
            src={getImagePath('logo.png')}
            alt="Loading..."
            height="90"
          />

          <Button
            className="button-login mt-4"
            onClick={() => loginWithRedirect()}
          >
            Log-in to Portal
          </Button>
        </Col>
      </Row>
    </Container>
  );
};
FrontendSharedComponentsLoginButton.displayName =
  'FrontendSharedComponentsLoginButton';
