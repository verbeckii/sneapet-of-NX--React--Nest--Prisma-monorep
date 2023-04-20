import { render } from '@testing-library/react';
import FrontendSharedComponentsBreadcrumbs from './frontend-shared-components-breadcrumbs';
describe('FrontendSharedComponentsBreadcrumbs', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FrontendSharedComponentsBreadcrumbs />);
    expect(baseElement).toBeTruthy();
  });
});
