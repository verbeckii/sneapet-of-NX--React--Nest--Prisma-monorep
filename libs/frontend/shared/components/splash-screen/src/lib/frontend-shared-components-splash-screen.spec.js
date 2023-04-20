import { render } from '@testing-library/react';
import FrontendSharedComponentsSplashScreen from './frontend-shared-components-splash-screen';
describe('FrontendSharedComponentsSplashScreen', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FrontendSharedComponentsSplashScreen />);
    expect(baseElement).toBeTruthy();
  });
});
