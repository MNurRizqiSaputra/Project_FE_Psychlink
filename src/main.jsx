import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ErrorPage from './pages/errorpage.jsx'
import LoginPage from './pages/authentikasi/login.jsx'
import RegisterPage from './pages/authentikasi/register.jsx'
import HomePasien from './pages/dahboard/pasien/index.jsx'
import HomeAdmin from './pages/dahboard/admin/index.jsx'
import HomePsikolog from './pages/dahboard/psikolog/index.jsx'
import JoinPsikolog from './pages/landingpage/joinpsikolog.jsx'
import withAuth from './withAuth.jsx'

const Authhomeadmin = withAuth(HomeAdmin, ['admin']);
const Authhomepsikolog = withAuth(HomePsikolog, ['psikolog']);
const Authhomepasien = withAuth(HomePasien, ['pasien']);

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/register',
    element: <RegisterPage />
  },
  {
    path: '/homepasien',
    element: <Authhomepasien />,
  },
  {
    path: '/homeadmin',
    element: <Authhomeadmin />,
  },
  {
    path: '/homepsikolog',
    element: <Authhomepsikolog />,
  },
  {
    path: '/joinpsikolog',
    element: <JoinPsikolog />,}
])


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
