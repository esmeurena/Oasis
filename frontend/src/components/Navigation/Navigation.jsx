import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <nav className="navigation">
      <div>
        <img src="/dist/orange_logo.png" className="oasis-logo" />
      </div>
      <div className="center-options">
        <NavLink to="/" className="nav-link">Home</NavLink>
        {/* <NavLink to="/spots" className="nav-link">Get All Spots</NavLink> */}
      </div>
      <div className="off-to-right">
        {sessionUser && (
          <NavLink to="/spots/newSpot" className="nav-link">
            Create a New Spot
          </NavLink>
        )}
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