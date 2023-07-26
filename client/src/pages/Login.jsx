import { useState } from 'react';
import axios from 'axios';
import useAxios from '../hooks/useAxios';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [{ response, isLoading, isError }, axiosRequest] = useAxios();

  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // test if needed
  });

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
      {/* <div>{isLoading && <h2>loading</h2>}</div> */}
      <div>{isError && <h2>invalid credentials</h2>}</div>
      <div>{response._id && <h2>data loaded</h2>}</div>
      <h3>{response.email}</h3>
      <h3>{response._id}</h3>
    </div>
  );
}
