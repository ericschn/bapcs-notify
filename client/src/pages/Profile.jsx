import { useEffect, useState } from 'react';
import useAxios from '../hooks/useAxios';

export function Profile() {
  // const [user, setUser] = useState({});
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [{ response: user, isLoading, isError }, axiosRequest] = useAxios();

  useEffect(() => {
    axiosRequest({
      url: '/user/profile',
      method: 'get',
      withCredentials: true,
    });
  }, []);

  return (
    <div>
      <h1>profile</h1>
      {!user ? (
        <p>loading</p>
      ) : (
        <ul>
          <li>Email: {user.email}</li>
          <li>Phone: {user.phone}</li>
          <li>In-App Notifications: {user.notifications?.app}</li>
          <li>Email Notifications: {user.notifications?.email}</li>
          <li>SMS Notifications: {user.notifications?.phone}</li>
        </ul>
      )}
    </div>
  );
}
