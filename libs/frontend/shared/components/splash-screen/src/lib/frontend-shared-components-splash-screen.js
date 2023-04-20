import { Container, Row, Col } from 'reactstrap';

export function FrontendSharedComponentsSplashScreen({ imgLoader }) {
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
          className="d-flex justify-content-center align-items-center"
        >
          <img className="logo" src={imgLoader} alt="Loading..." height="90" />
        </Col>
      </Row>
    </Container>
  );
}
FrontendSharedComponentsSplashScreen.displayName =
  'FrontendSharedComponentsSplashScreen';
export default FrontendSharedComponentsSplashScreen;
