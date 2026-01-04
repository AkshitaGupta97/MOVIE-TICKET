import Booking from "../modals/Booking.js";
import Show from "../modals/Show.js";
import User from "../modals/User.js";

// Api to check whether the selected seats are available for booking or not, as whether user is Admin
export const isAdmin = async (req, res) => {
    res.json({success: true, message: "User is Admin"});
}

// Api to get Dashboard data
export const getDashboardData = async (req, res) => {
    try {
       const booking = await Booking.find({isPaid: true});
       const activeShows = await Show.find({showDateTime: {$gte: new Date()}}).populate('movie');   // get shows whose showDateTime is greater than or equal to current date time
       const totalUser = await User.countDocuments(); // total number of users

       const dashboardData = {
        totalBookings : booking.length,
        totalEarnings : booking.reduce((total, b) => total + b.amount, 0), // calculate total earnings from paid bookings, e.g. if there are multiple bookings, sum up their amounts. as reduce method is used to accumulate values in an array
        activeShows, totalUser
       }
         res.json({success: true, dashboardData});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error in getting dashboard data"});
    }
}
// find is used to find a single document that matches the query criteria and returns the first matching document it finds. If no documents match the query, it returns null.
// countDocuments is used to count the number of documents in a collection that match the specified query criteria. It returns the count as a number.

// Api to get allShows
export const getAllShows = async (req, res) => {
    try {
        const shows = await Show.find().populate('movie'); // populate is used to fetch related movie details for each show
        res.json({success: true, shows});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error in getting all shows"});
    }
}

// Api to get all bookings
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({}).populate('user').populate({
            path: 'show',  // first we populate show inside booking, path:show means we are populating show field inside booking
            populate: {path: 'movie'}   //  means we are populating movie inside show
            // here we are using populate inside populate to get movie details inside show, as show references movie. an example here how populate work :
            //  if we have a booking document that references a show document, and that show document references a movie document, using populate in this way allows us to retrieve the full details of both the show and the associated movie in a single query.
        }).sort({createdAt: -1}); // sort bookings by createdAt in descending order
        res.json({success: true, bookings});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error in getting all bookings"});
    }
};
