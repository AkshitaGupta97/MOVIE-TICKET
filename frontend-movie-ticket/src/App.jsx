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

function App() {

  const isAdminRoute = useLocation().pathname.startsWith('/admin'); // it means we aere in admin page, and  in admin page we won't show Navbar and Footer
  
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
        <Route path="/admin/*" element={<Layout />}>
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