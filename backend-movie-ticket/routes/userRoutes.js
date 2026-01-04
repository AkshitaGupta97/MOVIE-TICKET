import express from "express";
import { getUserBookings, updateFavouriteMovie } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get('/bookings', getUserBookings);
userRouter.post('/update-favourite', updateFavouriteMovie);
userRouter.get('/favourite', getFavouriteMovies);

export default userRouter;
