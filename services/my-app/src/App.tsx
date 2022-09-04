import React, { useState } from 'react';
import { UserDetails } from './Components/UserDetailsComponent';

export const App = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [showBalance, setShowBalance] = useState(false);
  const [userId, setUserId] = useState('');

  const handleClick = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ firstName, lastName, email }),
      });
      const json = await res.json();
      setShowBalance(true);
      setUserId(json.id)
    } catch (error) {
      console.error(error);
      setShowBalance(true);
    }
  };

  return (
    <>
      <h1>Bitcoin App</h1>
      {!showBalance && (
        <>
          <div>
            <label>First Name:</label>
            <input type='text' aria-label='first-name' onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div>
            <label>Last Name:</label>
            <input type='text' aria-label='last-name' onChange={(e) => setLastName(e.target.value)} />
          </div>
          <div>
            <label>Email:</label>
            <input type='email' aria-label='email' onChange={(e) => setEmail(e.target.value)} />
          </div>
          <input type='submit' aria-label='submit' onClick={() => handleClick()} />
        </>
      )}
      {showBalance && (
        <UserDetails userId={userId} />
      )}
    </>
  );
};
