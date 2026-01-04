import { Route, Routes, useLocation } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Movies from "./pages/Movies"
import MovieDetails from "./pages/MovieDetails"
import SeatLayout from "./pages/SeatLayout"
import MyBooking from "./pages/MyBooking"
import Favourite from "./pages/Favourite"
import {Toaster} from 'react-hot-toast'
import Footer from "./components/Footer"

import Layout from "./ADMIN/Layout"
import Dashboard from "./ADMIN/Dashboard"
import AddShow from "./ADMIN/AddShow"
import ListShow from "./ADMIN/ListShow"
import ListBookings from "./ADMIN/ListBookings"
import { useAppContext } from "./context/AppContext"
import { SignIn } from "@clerk/clerk-react"

/**
 * App Component
 * 
 * Main application component that handles routing and layout management.
 * 
 * Features:
 * - Conditionally renders Navbar and Footer based on route (hidden on admin routes)
 * - Manages user authentication and access control
 * - Displays toast notifications globally
 * 
 * Routes:
 * - Public routes: Home, Movies, MovieDetails, SeatLayout, MyBooking, Favourite
 * - Admin routes: Dashboard, AddShow, ListShow, ListBookings (requires user authentication)
 * 
 * @component
 * @returns {JSX.Element} The main application layout with routing configuration
 * 
 * @param {Object} fallbackRedirectUrl - Used in SignIn component to redirect authenticated users
 *                                       after successful login. In this case, redirects to '/admin'
 *                                       so users are taken to the admin dashboard after sign-in
 *                                       instead of the default home page.
 */
function App() {

  const isAdminRoute = useLocation().pathname.startsWith('/admin'); // it means we aere in admin page, and  in admin page we won't show Navbar and Footer
  
  const {user, isAdmin} = useAppContext();

  return (
    <>
      <Toaster />
      {!isAdminRoute && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/movies/:id/:date" element={<SeatLayout />} />
        <Route path="/my-bookings" element={<MyBooking />} />
        <Route path="/favourite" element={<Favourite />} />

        {/* Route for Admin [/admin/*] after(/*) if we add any path we display same layout */}
        <Route path="/admin/*" element={isAdmin ? (
          <Layout />
        ) : (!user ? (
          <div className="min-h-screen flex justify-center items-center">
            <SignIn fallbackRedirectUrl={'/admin'} /> 
          </div>
        )  : (
          <div className="min-h-screen flex justify-center items-center">
            <p className="text-xl">Access denied — admin only</p>
          </div>
        ))}>
          <Route index element={<Dashboard />} />   {/* - The index route is the default child route. When you visit /admin, it will render <Dashboard /> inside <Layout />.*/}
          <Route path="add-shows" element={<AddShow />} />
          <Route path="list-shows" element={<ListShow />} />
          <Route path="list-bookings" element={<ListBookings />} />
        </Route>

      </Routes>

      {!isAdminRoute && <Footer />}
    </>
  )
}

export default App
/*
Admin user → Show <Layout /> (admin dashboard).
No user logged in → Show sign-in form.
Logged-in but not admin → Show “Access denied” message.
 */