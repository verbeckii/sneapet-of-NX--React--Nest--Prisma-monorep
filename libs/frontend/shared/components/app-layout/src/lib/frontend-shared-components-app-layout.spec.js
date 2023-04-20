import { render } from '@testing-library/react';
import FrontendSharedComponentsAppLayout from './frontend-shared-components-app-layout';
describe('FrontendSharedComponentsAppLayout', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FrontendSharedComponentsAppLayout />);
    expect(baseElement).toBeTruthy();
  });
});
