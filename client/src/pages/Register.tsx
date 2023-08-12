import { FormEvent, useState } from 'react';
import useAxios from '../hooks/useAxios';

export function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [{ response: user, isLoading, isError }, axiosRequest] = useAxios();

  const submitFormHandler = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      // set form errors
      console.log("passwords don't match");
    } else {
      axiosRequest({
        url: '/user/register',
        method: 'post',
        data: { email, password },
        withCredentials: true,
      });
    }
  };

  return (
    <div className="login-form">
      <h1>register</h1>
      <form onSubmit={submitFormHandler}>
        <label htmlFor="email-input">email</label>
        <input
          type="email"
          id="email-input"
          required
          placeholder="enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password-input">password</label>
        <input
          type="password"
          id="password-input"
          required
          placeholder="enter password"
          value={password}
          autoComplete="off"
          onChange={(e) => setPassword(e.target.value)}
        />

        <label htmlFor="password-input">confirm password</label>
        <input
          type="password"
          id="confirm-password-input"
          required
          placeholder="confirm password"
          value={confirmPassword}
          autoComplete="off"
          onChange={(e) => setConfirmPassword(e.target.value)}
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
