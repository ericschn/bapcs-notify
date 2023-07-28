import { Link } from 'react-router-dom';
import useAxios from '../hooks/useAxios';

import { AuthContext } from '../context/AuthContext';
import { useContext, useEffect } from 'react';

export function Navbar() {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const [{ response: user, isLoading, isError }, axiosRequest] = useAxios();

  useEffect(() => {
    // see if user is logged in after page load/refresh
    axiosRequest({
      url: '/user/profile',
      method: 'get',
      withCredentials: true,
    });
  }, []);

  useEffect(() => {
    console.log('user useEffect triggered:');
    console.log(user);
    if (user && user._id) {
      setIsLoggedIn(true);
    }
  }, [user]);

  const logoutHandler = async () => {
    try {
      console.log('logoutHandler running');
      axiosRequest({
        url: '/user/logout',
        method: 'post',
        withCredentials: true,
      });
      setIsLoggedIn(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">home</Link>
        </li>
        <li>
          <Link to="/new">new</Link>
        </li>

        {isLoggedIn ? (
          <>
            <li>
              <Link to="/profile">profile</Link>
            </li>
            <li>
              <Link onClick={logoutHandler}>logout</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">login</Link>
            </li>
            <li>
              <Link to="/register">register</Link>
            </li>
          </>
        )}
        {/* <li><Link to="/monitors">monitors</Link></li> */}
      </ul>
    </nav>
  );
}
