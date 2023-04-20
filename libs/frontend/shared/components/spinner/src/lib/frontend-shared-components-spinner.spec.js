import { render } from '@testing-library/react';
import FrontendSharedComponentsSpinner from './frontend-shared-components-spinner';
describe('FrontendSharedComponentsSpinner', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FrontendSharedComponentsSpinner />);
    expect(baseElement).toBeTruthy();
  });
});
