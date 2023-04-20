import { render } from '@testing-library/react';
import FrontendSharedFunction from './frontend-shared-function';
describe('FrontendSharedFunction', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FrontendSharedFunction />);
    expect(baseElement).toBeTruthy();
  });
});
