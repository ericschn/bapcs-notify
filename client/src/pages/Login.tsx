import { useContext, useEffect, useState } from 'react';
import useAxios from '../hooks/useAxios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [{ response: user, isLoading, isError }, axiosRequest] = useAxios();
  const { setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const submitFormHandler = (e: any) => {
    e.preventDefault();
    handleUserLogin();
  };

  const handleUserLogin = async () => {
    await axiosRequest({
      url: '/user/auth',
      method: 'post',
      data: { email, password },
      withCredentials: true,
    });
  };

  useEffect(() => {
    if (user._id) {
      setIsLoggedIn(true);
      navigate('/profile');
    }
  }, [user]);

  return (
    <div className="login-form">
      <h1>login</h1>
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
          onChange={(e) => setPassword(e.target.value)}
        />

        <button disabled={isLoading} type="submit">
          submit
        </button>
      </form>
      <div>{isLoading && <h2>loading</h2>}</div>
      <div>{isError && <h2>invalid credentials</h2>}</div>

      {user._id && (
        <ul>
          <li>Email: {user.email}</li>
          <li>Id: {user._id}</li>
        </ul>
      )}
    </div>
  );
}
