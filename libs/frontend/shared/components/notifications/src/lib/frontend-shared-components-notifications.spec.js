import { render } from '@testing-library/react';
import FrontendSharedComponentsNotifications from './frontend-shared-components-notifications';
describe('FrontendSharedComponentsNotifications', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FrontendSharedComponentsNotifications />);
    expect(baseElement).toBeTruthy();
  });
});
