import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import List from './List';

describe('<List />', () => {
  test('should mount', () => {
    render(<List />);

    const list = screen.getByTestId('List');

    expect(list).toBeInTheDocument();
  });
});