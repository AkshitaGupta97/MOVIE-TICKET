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
        const {userId} = req.auth();
        const {showId, selectedSeats} = req.body;
        const {origin} = req.headers; // Get the origin from request headers as we are not using cors middleware, eg: http://localhost:3000 or https://mymovieticketapp.com, 
        // origin will help to identify the frontend from where the request is coming, so that we can handle cors accordingly. here origin is dynamic based on the frontend app. eg: localhost or production domain

        // check if seat is available for selected show
        const isSeatAvailable = await checkSeatAvailability(showId, selectedSeats);
        if(!isSeatAvailable){
            return res.status(400).json({message: "Selected seats are already booked. Please choose different seats."});
        }
        // proceed with booking logic here = get show details
        const showData = await Show.findById(showId).populate('movie'); // populate movie details, populate means to fetch the related movie document based on the reference in show document, we get movie from show schema
        if(!showData){
            return res.status(404).json({message: "Show not found"});
        }
        // create new bookings
        const booking = await Booking.create({
            user: userId,
            show: showId,
            amount: showData.showPrice * selectedSeats.length,
            bookedSeats: selectedSeats,
        });
        // reserve seat in showData
        selectedSeats.map((seat) => { 
            showData.occupiedSeats[seat] = userId; // mark seat as occupied by userId, occupiedSeats[seat] is like a key value pair, seat is key and userId is value
        });
        showData.markModified('occupiedSeats'); // mark occupiedSeats as modified to let mongoose know that this field is updated, markModified is used when we update nested objects or arrays in mongoose schema. 
        
        await showData.save(); // save updated showData with occupied seats

        // stripe Payment  Gateway initilization... skipped for now

        return res.status(201).json({message: "Booking successful", booking});
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: "Internal Server Error"});
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

