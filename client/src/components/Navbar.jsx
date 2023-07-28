import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <nav>
      <ul>
        <li><Link to="/">home</Link></li>
        <li><Link to="/new">new</Link></li>
        <li><Link to="/login">login</Link></li>
        <li><Link to="/register">register</Link></li>
        <li><Link to="/profile">profile</Link></li>
        {/* <li><Link to="/monitors">monitors</Link></li> */}
      </ul>
    </nav>
  );
}
