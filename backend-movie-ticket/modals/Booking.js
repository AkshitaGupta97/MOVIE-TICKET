import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user: {type: String, required: true, ref: "User"}, // references User model
    show: {type: String, required: true, ref: "Show"}, // references Show model
    amount: {type: Number, required: true},
    bookedSeats: {type: Array, required: true},
    isPaid: {type: Boolean, default: false},
    paymentLink: {type: String},
}, {timestamps: true} // automatically adds createdAt and updatedAt fields
)

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;