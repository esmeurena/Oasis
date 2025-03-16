import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul>
      <li>
        <NavLink to="/" className="nav-link">Home</NavLink>
        <NavLink to="/spots" className="nav-link">Get All Spots</NavLink>
      </li>
      {isLoaded && (
        <div className="profile-button">
        <ProfileButton user={sessionUser} />
      </div>
      )}
    </ul>
  );
}

export default Navigation;