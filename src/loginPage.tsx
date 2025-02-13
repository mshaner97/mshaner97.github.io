import React, { useState, useContext } from 'react';
import { UserContext } from './userContext';

function LoginForm() {
  const [username, setUsername] = useState('');
  const { setUser } = useContext(UserContext);
  
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Login submitted:', username);
    setUser(username);
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}/>
        </div>
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default LoginForm;