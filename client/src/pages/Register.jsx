import { useState } from 'react';

export function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [{ res, isLoading, isError }, axiosRequest] = useAxios();

  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // test if needed
  });

  const submitFormHandler = async (e) => {
    e.preventDefault();

    console.log('submitFormHandler');

    axiosRequest({
      url: '/user/auth',
      method: 'post',
      data: { email, password },
      withCredentials: true,
    });

    console.log(res);
  };

  return (
    <div className="login-form">
      <h1>register</h1>
      <form onSubmit={submitFormHandler}>
        <label>email</label>
        <input
          type="email"
          required
          placeholder="enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>password</label>
        <input
          type="password"
          required
          placeholder="enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label>confirm password</label>
        <input
          type="password"
          required
          placeholder="confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </form>
    </div>
  );
}
