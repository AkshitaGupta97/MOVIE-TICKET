import express from "express";
import { addShow, getNowPlayingMovies, getShows, getSingleShow } from "../controllers/showController.js";
import { protectAdmin } from "../middleware/auth.js";

const showRouter = express.Router();

showRouter.get('/now-playing', protectAdmin, getNowPlayingMovies); // Protected route for now playing movies
showRouter.post('/add', protectAdmin, addShow);
showRouter.get('/all', getShows); // Public route to get all shows
showRouter.get('/:movieId', getSingleShow); // Public route to get single show by movie ID

export default showRouter;
