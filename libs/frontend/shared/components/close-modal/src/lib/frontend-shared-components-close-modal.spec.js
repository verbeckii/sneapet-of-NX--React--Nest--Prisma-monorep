import { render } from '@testing-library/react';
import FrontendSharedComponentsCloseModal from './frontend-shared-components-close-modal';
describe('FrontendSharedComponentsCloseModal', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FrontendSharedComponentsCloseModal />);
    expect(baseElement).toBeTruthy();
  });
});
