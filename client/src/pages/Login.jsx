import { useState } from 'react';
import axios from 'axios';
import useAxios from '../hooks/useAxios';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [{ response: user, isLoading, isError }, axiosRequest] = useAxios();

  const submitFormHandler = async (e) => {
    e.preventDefault();

    axiosRequest({
      url: '/user/auth',
      method: 'post',
      data: { email, password },
      withCredentials: true,
    });
  };

  return (
    <div className="login-form">
      <h1>login</h1>
      <form onSubmit={submitFormHandler}>
        <label>email</label>
        <input
          type="text"
          // required
          placeholder="enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>password</label>
        <input
          type="text"
          // required
          placeholder="enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button disabled={isLoading} type="submit">
          submit
        </button>
      </form>
      <div>{isLoading && <h2>loading</h2>}</div>
      <div>{isError && <h2>invalid credentials</h2>}</div>

      {user && (
        <ul>
          <li>Email: {user.email}</li>
          <li>Id: {user._id}</li>
        </ul>
      )}
    </div>
  );
}
