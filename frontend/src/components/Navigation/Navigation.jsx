import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <nav className="navigation">
      <div className="oasis-nav">
        <NavLink to="/" className="nav-link">
          <img src="/dist/orange_logo.png" className="oasis-logo" />
        </NavLink>

        <p className="oasis-text">oasis</p>

      </div>
      <div className="off-to-right">
        {sessionUser && (
          <NavLink to="/spots/newSpot" className="new-spot-link">
            Create a New Spot
          </NavLink>
        )}
      </div>

      {isLoaded && (
        <div className="profile-nav">
          
          <div className="profile-button">
            <ProfileButton user={sessionUser} />
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navigation;