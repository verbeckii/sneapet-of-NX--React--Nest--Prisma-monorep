import { render } from '@testing-library/react';
import FrontendSharedConstant from './frontend-shared-constant';
describe('FrontendSharedConstant', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FrontendSharedConstant />);
    expect(baseElement).toBeTruthy();
  });
});
