import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import App from './App';
import { BrowserRouter, RouterProvider } from 'react-router-dom';
import Landing from './pages/Landing/Landing';
import Login from './pages/Login/Login';


/*const router = BrowserRouter([
  {
    path: "/",
    element: <Landing/>
  }
  ,
  {
    path: "/login",
    element: <Login/>
  }
])
*/
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>
);

