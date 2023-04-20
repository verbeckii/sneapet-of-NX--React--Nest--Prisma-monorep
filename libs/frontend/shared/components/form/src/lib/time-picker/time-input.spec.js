import { render } from '@testing-library/react';
import TimeInput from './time-input';
describe('TimeInput', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TimeInput />);
    expect(baseElement).toBeTruthy();
  });
});
