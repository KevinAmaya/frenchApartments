import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Homepage from './Homepage';

describe('<Homepage />', () => {
  test('should mount', () => {
    render(<Homepage />);

    const homepage = screen.getByTestId('Homepage');

    expect(homepage).toBeInTheDocument();
  });
});