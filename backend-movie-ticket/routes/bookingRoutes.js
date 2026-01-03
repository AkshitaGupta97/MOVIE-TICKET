import express from 'express';
import {  createBooking, getOccupiedSeats,  } from '../controllers/BookingController.js';

const bookingRouter = express.Router();

bookingRouter.post('/create', createBooking); // Route to create a new booking
bookingRouter.get('/seats/:showId', getOccupiedSeats); // Route to get occupied seats for a show

export default bookingRouter;

// post : is used when we want to create or submit data to the server, such as creating a new booking in this case.
// get : is used when we want to retrieve or fetch data from the server, such as getting the occupied seats for a specific show in this case.