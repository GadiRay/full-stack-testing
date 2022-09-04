import { render, screen } from '@testing-library/react';
import { Greet } from './GreetComponent';

describe('<Greet />', () => {
  it('Should display Hello Gadi when name is Gadi', () => {
    // Arange
    const name = 'Gadi';
    // Act
    render(<Greet name={name} />);
    // Assert
    const element = screen.getByText(`Hello ${name}`);
    expect(element).toBeInTheDocument();
  });
});
