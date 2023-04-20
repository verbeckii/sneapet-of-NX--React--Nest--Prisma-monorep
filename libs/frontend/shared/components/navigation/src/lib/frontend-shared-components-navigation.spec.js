import { render } from '@testing-library/react';
import FrontendSharedComponentsNavigation from './frontend-shared-components-navigation';
describe('FrontendSharedComponentsNavigation', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FrontendSharedComponentsNavigation />);
    expect(baseElement).toBeTruthy();
  });
});
