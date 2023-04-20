import { render } from '@testing-library/react';
import FrontendSharedComponentsLinks from './frontend-shared-components-links';
describe('FrontendSharedComponentsLinks', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FrontendSharedComponentsLinks />);
    expect(baseElement).toBeTruthy();
  });
});
