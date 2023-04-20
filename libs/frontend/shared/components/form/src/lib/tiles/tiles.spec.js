import { render } from '@testing-library/react';
import Tiles from './tiles';
describe('Tiles', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Tiles />);
    expect(baseElement).toBeTruthy();
  });
});
