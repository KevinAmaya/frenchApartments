import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BestItem from './BestItem';

describe('<BestItem />', () => {
  test('should mount', () => {
    render(<BestItem />);

    const bestItem = screen.getByTestId('BestItem');

    expect(bestItem).toBeInTheDocument();
  });
});