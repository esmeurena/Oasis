import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <nav className="navigation">
      <div>
        <img src="/dist/orange_logo.png" className="oasis-logo"/>
      </div>
      <div>
        <div>
          <NavLink to="/" className="nav-link">Home</NavLink>
          <NavLink to="/spots" className="nav-link">Get All Spots</NavLink>
        </div>
      </div>
      {isLoaded && (
        <div className="profile-button">
          <ProfileButton user={sessionUser} />
        </div>
      )}
    </nav>
  );
}

export default Navigation;