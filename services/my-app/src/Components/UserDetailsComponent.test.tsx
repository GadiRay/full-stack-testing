import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { v4 as uuidv4 } from 'uuid';

import { UserDetails, User } from './UserDetailsComponent';

const mockUser: User = {
  firstName: 'Gadi',
  lastName: 'Raymond',
  email: 'gadi@wix.com',
  bitcoins: 5
};
const server = setupServer(
  rest.get('http://localhost:3001/api/v1/users/:userId', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockUser));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('<UserDetails />', () => {
  it('should display no user details when checkbox is unchecked', () => {
    const userId = uuidv4();

    render(<UserDetails userId={userId} />);
    const linkElement = screen.getByText(
      `User ${userId} details is hidden`
    );
    expect(linkElement).toBeInTheDocument();
  });
  it('should display user details when checkbox is checked', async () => {
    const { firstName, lastName, email, bitcoins } = mockUser;
    const userId = uuidv4();
    const userDetailsTitle = 'User Details';

    render(<UserDetails userId={userId} />);
    expect(screen.queryByText(userDetailsTitle)).toBeNull();
    fireEvent.click(screen.getByLabelText(/show/i));
    expect(screen.getByText(userDetailsTitle)).toBeInTheDocument();
    expect(
      await screen.findByText(`Hello ${firstName} ${lastName}`)
    ).toBeInTheDocument();
    expect(screen.getByText(`Your email is ${email}`)).toBeInTheDocument();
    expect(screen.getByText(`Your have ${bitcoins} bitcoins`)).toBeInTheDocument();
  });
  it('should display error message when the api returns 500', async () => {
    const userId = uuidv4();
    server.use(
      rest.get('http://localhost:3001/api/v1/users/:userId', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<UserDetails userId={userId} />);
    const linkElement = await screen.findByText(
      'There is an error API returned 500'
    );
    expect(linkElement).toBeInTheDocument();
  });

  it('should display not found message when the api returns 404', async () => {
    const userId = uuidv4();
    server.use(
      rest.get('http://localhost:3001/api/v1/users/:userId', (req, res, ctx) => {
        return res(ctx.status(404));
      })
    );

    render(<UserDetails userId={userId} />);
    const linkElement = await screen.findByText(
      `There is an error user ${userId} not found`
    );
    expect(linkElement).toBeInTheDocument();
  });
});
