import { render } from '@testing-library/react';
import FrontendSharedComponentsTopNavigation from './frontend-shared-components-top-navigation';
describe('FrontendSharedComponentsTopNavigation', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FrontendSharedComponentsTopNavigation />);
    expect(baseElement).toBeTruthy();
  });
});
