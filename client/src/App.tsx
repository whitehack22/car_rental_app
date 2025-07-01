import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router'
import LandingPage from './pages/LandingPage'
import Register from './pages/auth/Register'
import Login from './pages/auth/Login'
import AboutPage from './pages/AboutPage'
import AdminDashboard from './pages/dashboard/AdminDashboard/AdminDashboard'
import Error from './components/error/Error'
import VerifyUser from './pages/auth/VerifyUser'
import { Toaster } from 'sonner'
import UserDashboard from './pages/dashboard/UserDashboard/UserDashboard'
import { type RootState } from './app/store'
import { useSelector } from 'react-redux'
import Cars from './pages/dashboard/AdminDashboard/cars/Cars'
import Bookings from './pages/dashboard/AdminDashboard/bookings/Bookings'
import Users from './pages/dashboard/AdminDashboard/manageUsers/Users'
import Profile from './pages/dashboard/AdminDashboard/Profile'
import UserCars from './pages/dashboard/UserDashboard/cars/UserCars'
import UserBookings from './pages/dashboard/UserDashboard/bookings/UserBookings'
import UserProfile from './pages/dashboard/UserDashboard/UserProfile'

function App() {
  const isAdmin = useSelector((state: RootState) => state.customer.customer?.role === 'admin');
  const isUser = useSelector((state: RootState) => state.customer.customer?.role === 'user');

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
      path: '/register/verify',
      element: <VerifyUser />
    },
    {
      path: '/login',
      element: <Login />
    },
     // Admin Dashboard Routes
    {
      path: '/admin/dashboard',
       element: isAdmin ? <AdminDashboard /> : <Login />,
       children: [
        {
          path: 'analytics',
          element: <h1>Analytics</h1>
        },
        {
          path: 'bookings',
          element: <Bookings/>
        },
        {
          path: 'cars',
          element: <Cars />
        },
        {  
          path: 'users',
          element: <Users />
        },
        {
          path: 'profile',
          element: <Profile />
        },
        
      ]
    },
     // User Dashboard Routes
    {
      path: '/user/dashboard',
      element: isUser ? <UserDashboard /> : <Login />,
       children: [
        {
          path: 'analytics',
          element: <h1>Analytics</h1>
        },
        {
          path: 'bookings',
          element: <UserBookings />
        },
        {
          path: 'cars',
          element: <UserCars />
        },
        {
          path: 'profile',
          element: <UserProfile />
        },
        
      ]
    },
    {
      path: '*',
      element: <Error />
    }
  ])

  return (
    <>
      <RouterProvider router={router} />
       <Toaster position='top-right' toastOptions={{
        classNames: {
          error: 'bg-red-500 text-white',
          success: 'bg-green-500 text-white',
          info: 'bg-blue-500 text-white',
        }

      }} />
    </>
  )
}

export default App
