import { clerkClient } from "@clerk/express";
import Booking from "../modals/Booking.js";
import Movie from "../modals/Movie.js";

// Api to get user booking
export const getUserBookings = async (req, res) => {
    try {
        const user = req.auth().userId; // get userId from req.auth
        const bookings = await Booking.find({user}).populate({
            path: 'show',  // first we populate show inside booking, path:show means we are populating show field inside booking
            populate: {path: 'movie'} // means we are populating movie inside show
        }).sort({createdAt: -1});
        res.json({success: true, bookings});
    } catch (error) {
        console.error(error.message);
        res.json({success: false, message: "Error in getting user bookings"});
    }
}

// Api controller function to update [add,] Favourite Movie in Clerk User Metadata
export const updateFavouriteMovie = async (req, res) => {
    try {
        const {movieId} = req.body;
        const userId = req.auth().userId;
        const user = await clerkClient.users.getUser(userId); // fetch all user details from Clerk
        if(!user.privateMetadata.favourites){ // if no favourite movie exists, privateMetadata means metadata that is only accessible to the server-side code, as it is not exposed to the client-side. Private metadata is server-accessible data stored with the user and not exposed to the client by default.
            // .privateMetadata.favourites means the user's favourite movies are stored in the private metadata of the Clerk user. we can store favourite movies in privateMetadata is in the frontend while calling this api we can send an array of movieIds to be stored in privateMetadata
            user.privateMetadata.favourites = [];
        }
        if(!user.privateMetadata.favourites.includes(movieId)){
            user.privateMetadata.favourites.push(movieId); // add movieId to favourites array
        }
        else { // if movieId already exists in favourites, we remove it (toggle functionality)
            user.privateMetadata.favourites = user.privateMetadata.favourites.filter(id => id !== movieId); // remove movieId from favourites array, by filtering out the movieId to be removed
        }
        await clerkClient.users.updateUser(userId, { // update user in Clerk, as we have modified the user's privateMetadata by adding a new favourite movie
            privateMetadata: {
                favourites: user.privateMetadata.favourites
            }
        });
        res.json({success: true, message: "Favourite movie updated"});

    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error in adding favourite movie"});
    }
}

// Api to get Favourite Movies of a user
export const getFavouriteMovies = async (req, res) => {
    try {
        const user = await clerkClient.users.getUser(req.auth().userId); // fetch user from Clerk.
        const favourites = user.privateMetadata.favourites || []; // get favourites from privateMetadata, if no favourites exist, return empty array

        // getting movie from database
        const movies = await Movie.find({_id: {$in: favourites}}); // $in operator is used to find all movies whose _id is in the favourites array (favourite movieIds)
        return res.json({success: true, movies}); 
    } catch (error) {
        console.error(error);
        return res.json({success: false, message: "Error in getting favourite movies"});
    }
}
