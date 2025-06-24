import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router'
import LandingPage from './pages/LandingPage'
import Register from './pages/Register'
import Login from './pages/Login'
import AboutPage from './pages/AboutPage'
import Dashboard from './pages/dashboard/Dashboard'
import Error from './components/error/Error'
function App() {
 const router = createBrowserRouter([
    {
      path: '/',
      element: <LandingPage />,
    },
    {
      path: '/about',
      element: <AboutPage />
    },
    {
      path: '/register',
      element: <Register />
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/dashboard',
      element: <Dashboard />,
      
    },
    {
      path: '*',
      element: <Error />
    }
  ])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
