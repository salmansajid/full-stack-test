import React from 'react';
import { Navigate } from 'react-router-dom';
import MainLayout from '../src/layouts/MainLayout';
import DashboardLayout from '../src/layouts/DashboardLayout';

import LoginView from '../src/views/auth/LoginView';
import NotFoundView from '../src/views/errors/NotFoundView';
import UserView from '../src/views/administration/user/UserView';
import VehicleView from './views/administration/vehicle/VehicleView';
import CoordinatesView from '../src/views/administration/coordinates/CoordinatesView';

import { isSuperAdmin } from './utils/common';


const routes = (user) => [
  {
    path: 'administration',
    element: !!user ? <DashboardLayout /> : <Navigate to='/login' />,
    children: [
      {
        path: 'user',
        element: isSuperAdmin(user) ? <UserView /> : <Navigate to='404' />,
      },
      { path: 'vehicle', element: <VehicleView /> },
      { path: 'coordinates', element: <CoordinatesView /> },
      { path: '/', element: isSuperAdmin(user) ? <Navigate to='/administration/vehicle' /> : <Navigate to='/administration/user' /> },
      
      { path: '*', element: <Navigate to='/404' /> }
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <LoginView /> },
      { path: '404', element: <NotFoundView /> },
      { path: '/', element: !!user ? <Navigate to='/administration' /> : <Navigate to='/login' /> }
    ]
  },
];

export default routes;
