import { render } from '@testing-library/react';
import FrontendSharedComponentsDeleteModal from './frontend-shared-components-delete-modal';
describe('FrontendSharedComponentsDeleteModal', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FrontendSharedComponentsDeleteModal />);
    expect(baseElement).toBeTruthy();
  });
});
