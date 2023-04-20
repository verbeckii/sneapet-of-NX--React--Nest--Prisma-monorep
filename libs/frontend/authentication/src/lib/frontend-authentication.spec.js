import { render } from '@testing-library/react';
import FrontendAuthentication from './frontend-authentication';
describe('FrontendAuthentication', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FrontendAuthentication />);
    expect(baseElement).toBeTruthy();
  });
});
