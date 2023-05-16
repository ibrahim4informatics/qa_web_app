import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './styles/index.css';

import Page404 from './pages/page404';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import 'react-toastify/dist/ReactToastify.css';
import { CookiesProvider } from 'react-cookie';
import Profile from './pages/Profile';
import SinglePost from './pages/SinglePost';

const root = ReactDOM.createRoot(document.getElementById('root'));
const router = createBrowserRouter([
  { path: "/", element: <Home />, errorElement: <Page404 /> },
  { path: "/profile", element: <Profile/>, errorElement: <Page404 /> },
  { path: "/post/:post_id", element: <SinglePost/>, errorElement: <Page404 /> },
  { path: "/login", element: <Login />, errorElement: <Page404 /> },
  { path: "/register", element: <Register />, errorElement: <Page404 /> },
])
root.render(
  <React.StrictMode>
    <CookiesProvider>
      <RouterProvider router={router} />
    </CookiesProvider>
  </React.StrictMode>
);

