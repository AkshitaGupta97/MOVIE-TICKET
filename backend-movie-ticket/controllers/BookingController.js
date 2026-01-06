import Booking from "../modals/Booking.js";
import Show from "../modals/Show.js";

// function to check seates availibilty of selected seat for a movie
const checkSeatAvailability = async (showId, selectedSeats) => {
    try {
        const showData = await Show.findById(showId);
        if(!showData){
            throw new Error("Show not found");
        }
        const occupiedSeats = showData.occupiedSeats || [];
        const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat]); // Check if any of the selected seats are already occupied
        return !isAnySeatTaken; // If none of the seats are taken, return true
    } catch (error) {
        console.log(error.message);
        return false;
    }
}
// create booking function
export const createBooking = async (req, res) => {
    try {
        const auth = typeof req.auth === 'function' ? req.auth() : null;
        if (!auth || !auth.userId) {
            return res.status(401).json({success: false, message: 'Unauthorized. Please login.'});
        }
        const userId = auth.userId;
        
        const {showId, selectedSeats} = req.body;
        
        // Validate inputs
        if (!showId) return res.status(400).json({success: false, message: "showId is required"});
        if (!Array.isArray(selectedSeats) || selectedSeats.length === 0) {
            return res.status(400).json({success: false, message: "selectedSeats must be a non-empty array"});
        }

        // Fetch show and validate it exists
        const showData = await Show.findById(showId).populate('movie');
        if(!showData){
            return res.status(404).json({success: false, message: "Show not found"});
        }

        // Check if seats are available
        const occupiedSeatsObj = showData.occupiedSeats || {};
        const isAnySeatTaken = selectedSeats.some(seat => Boolean(occupiedSeatsObj[seat]));
        if(isAnySeatTaken){
            return res.status(400).json({success: false, message: "Selected seats are already booked. Please choose different seats."});
        }

        // Create new booking
        const booking = await Booking.create({
            user: userId,
            show: showId,
            amount: showData.showPrice * selectedSeats.length,
            bookedSeats: selectedSeats,
        });

        // Mark seats as occupied
        selectedSeats.forEach((seat) => { 
            showData.occupiedSeats[seat] = userId;
        });
        showData.markModified('occupiedSeats');
        await showData.save();

        return res.status(201).json({success: true, message: "Booking successful", booking});
    } catch (error) {
        console.error('Error in createBooking:', error.message);
        return res.status(500).json({success: false, message: "Internal Server Error"});
    }
}
// markModified: is used to inform Mongoose that a specific field in a document has been modified. This is particularly useful when dealing with nested objects or arrays, as Mongoose may not automatically 
// detect changes made to them. By calling markModified on a field, you ensure that Mongoose recognizes the modification and includes it in the next save operation.

// Get Occupied Seats
export const getOccupiedSeats = async (req, res) => {
    try {
        const {showId} = req.params; // showId from request parameters, e.g: /api/bookings/occupied-seats/:showId
        const showData = await Show.findById(showId);

        const occupiedSeat = Object.keys(showData.occupiedSeats); // get all keys from occupiedSeats object, keys are the seat numbers which are occupied, e.g: {A1: userId1, A2: userId2} => keys are [A1, A2]
        return res.status(200).json({occupiedSeats: occupiedSeat});
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

