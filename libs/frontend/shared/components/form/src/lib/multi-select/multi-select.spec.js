import { render } from '@testing-library/react';
import MultiSelect from './multi-select';
describe('MultiSelect', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MultiSelect />);
    expect(baseElement).toBeTruthy();
  });
});
