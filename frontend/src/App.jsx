import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';
import * as sessionActions from './store/session';
import GetAllSpots from './components/GetAllSpots';
import GetSingleSpot from './components/GetSingleSpot';
import CreateNewSpot from './components/CreateNewSpot';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <h1>Welcome!</h1>
      },
      {
        path: '/spots',
        element: <GetAllSpots />,
      },
      {
        path: '/spots/:spotId',
        element: <GetSingleSpot />,
      },
      {
        path: '/spots/newSpot',
        element: <CreateNewSpot />,
      },
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;