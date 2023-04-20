import { render } from '@testing-library/react';
import FrontendSharedComponentsButtonDropdown from './frontend-shared-components-button-dropdown';
describe('FrontendSharedComponentsButtonDropdown', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FrontendSharedComponentsButtonDropdown />);
    expect(baseElement).toBeTruthy();
  });
});
