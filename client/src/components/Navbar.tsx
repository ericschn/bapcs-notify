import { Link } from 'react-router-dom';
import useAxios from '../hooks/useAxios';

import { AuthContext } from '../context/AuthContext';
import { useContext, useEffect } from 'react';

export function Navbar() {
  const { isLoggedIn, setIsLoggedIn } = useContext<{
    isLoggedIn?: any;
    setIsLoggedIn?: any;
  }>(AuthContext);
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
    if (user && user._id) {
      setIsLoggedIn(true);
    }
  }, [user]);

  const logoutHandler = async () => {
    try {
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

        <li className="navbar-toggle">
          <label htmlFor="toggle-old-reddit">use old.reddit.com links</label>
          <input type="checkbox"></input>
        </li>
      </ul>
    </nav>
  );
}
