import { useEffect, useState } from 'react';

export type User = {
  firstName: string;
  lastName: string;
  email: string;
  bitcoins: number;
};
export const UserDetails = ({ userId }: { userId: string }) => {
  const [user, setUser] = useState({} as User);
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState({} as Error);
  useEffect(() => {
    async function fetchUserDetails() {
      const res = await fetch(`http://localhost:3001/api/v1/users/${userId}`);
      if (res.status === 500) {
        setError(new Error('API returned 500'));
        return;
      }
      if (res.status === 404) {
        setError(new Error(`user ${userId} not found`));
        return;
      }

      const userRes = await res.json();
      setUser(userRes);
    }

    fetchUserDetails();
  }, [userId]);

  if (error.message) {
    return <div>There is an error {error.message}</div>;
  }

  const { firstName, lastName, email, bitcoins } = user;

  return (
    <>
      {showDetails && (
        <>
          <h2>User Details</h2>
          <h3>
            Hello {firstName} {lastName}
          </h3>
          <h3>Your email is {email}</h3>
          <h3 className='bitcoins-count'>Your have {bitcoins} bitcoins</h3>
        </>
      )}
      {!showDetails && (
        <>
          <h2> User {userId} details is hidden</h2>
          <label htmlFor='toggle'>Show Details</label>
          <input
            id='toggle'
            type='checkbox'
            onChange={(e) => setShowDetails(e.target.checked)}
            checked={showDetails}
            aria-label='show-details'
          />
        </>
      )}
    </>
  );
};
