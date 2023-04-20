import { render } from '@testing-library/react';
import FrontendSharedComponentsLoginButton from './frontend-shared-components-login-button';
describe('FrontendSharedComponentsLoginButton', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FrontendSharedComponentsLoginButton />);
    expect(baseElement).toBeTruthy();
  });
});
