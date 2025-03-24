import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';
import * as sessionActions from './store/session';
import GetAllSpots from './components/GetAllSpots';
import GetSingleSpot from './components/GetSingleSpot';
import CreateNewSpot from './components/CreateNewSpot';
import UpdateSpot from './components/UpdateSpot';
import SpotManagement from './components/SpotManagement'

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
        element: <GetAllSpots />,
      },
      // {
      //   path: '/spots',
      //   element: <GetAllSpots />,
      // },
      {
        path: '/spots/:spotId',
        element: <GetSingleSpot />,
      },
      {
        path: '/spots/newSpot',
        element: <CreateNewSpot />,
      },
      {
        path: '/spots/:spotId/update',
        element: <UpdateSpot />,
      },
      {
        path: '/spots/spotManagement',
        element: <SpotManagement />,
      },
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;