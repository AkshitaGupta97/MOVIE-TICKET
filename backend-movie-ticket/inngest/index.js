import { Inngest } from "inngest";
import User from "../modals/User.js";
import connectDB from "../config/db.js";
import Booking from "../modals/Booking.js"
import Show from "../modals/Show.js"
import sendEmail from "../config/nodemailerBrevo.js";
// Create a client to send and receive events
export const inngest = new Inngest({ id: "movieTicket" });
// Creates an Inngest client named "movieTicket". This client is used to define functions that respond to events.

// inngest function to save user data to database
const syncUserCreation = inngest.createFunction(
    { id: 'sync-user-from-clerk' },
    { event: 'clerk/user.created' },
    async ({ event }) => {
        await connectDB();
        const { id, first_name, last_name, email_addresses, image_url } = event.data.user; // user comes from clerk
        const userData = {
            _id: id,
            email: email_addresses?.[0]?.email_address || null,
            name: first_name + ' ' + last_name,
            image: image_url
        }
        // store in database
        await User.create(userData);
    }
)

// inngest function to delete user from database
const syncUserDeletion = inngest.createFunction(
    { id: 'delete-user-with-clerk' },
    { event: 'clerk/user.deleted' },
    async ({ event }) => {
        await connectDB();
        const { id } = event.data.user
        await User.findByIdAndDelete(id)
    }
)

// inngest function to update data in database

const syncUserUpdation = inngest.createFunction(
    { id: 'update-user-from-clerk' },
    { event: 'clerk/user.updated' },
    async ({ event }) => {
        await connectDB();
        const { id, first_name, last_name, email_addresses, image_url } = event.data.user
        const userData = {
            _id: id,
            email: email_addresses?.[0]?.email_address || null,
            name: `${first_name || ""} ${last_name || ""}`.trim(),
            image: image_url || null
        }
        await User.findByIdAndUpdate(id, userData)
    }

)

// ingest function to cancle booking and release seats of show after 10 minutes of booking 
// created if payment is not made.

const releaseSeatsAndDeleteBooking = inngest.createFunction(
    { id: 'release-seats-delete-booking' },
    { event: 'app/checkpayment' },
    // use scheduling function o inngest
    async ({ event, step }) => {
        const tenMinutesLater = new Date(Date.now() + 10 * 60 * 1000);
        await step.sleepUntil('wait-for-10-minutes', tenMinutesLater);

        await step.run('check-payment-status', async () => {
            const bookingId = event.data.bookingId;
            const booking = await Booking.findById(bookingId);

            // if payment is not made within 10 minutes, release seat and delete booking
            if (!booking.isPaid) {
                const show = await Show.findById(booking.show);
                booking.bookedSeats.forEach((seat) => {
                    delete show.occupiedSeats[seat]
                });
                show.markModified('occupiedSeats')
                await show.save()
                await Booking.findByIdAndDelete(booking._id)

            }
        })
    }
);

// inngest function to send email when user books a show
const sendBookingConfirmationEmail = inngest.createFunction(
    { id: 'send-booking-confirmation-email' },
    { event: 'app/show.booked' },
    async ({ event }) => {
        const { bookingId } = event.data;

        const booking = await Booking.findById(bookingId).populate({
            path: 'show',
            populate: { path: "movie", model: "Movie" }
        }).populate('user');
        if (!booking) return;

        // getting sendEmail from nodemailer
        await sendEmail({
            to: booking.user.email,
            subject: `Payment Confirmation: "${booking.show.movie.title}" booked!`,
            body: `<div>
                    <p className='w-44 h-auto text-2xl'> Movie<span className='text-pink-600'>Mate</span>🎬</p>
                    <h2> Hi Dear, 💖<span className="text-pink-600 font-bold border-b-amber-300">${booking.user.name}</span></h2>
                    <p>Your booking🎟️ for <strong className="text-red-500">{booking.show.movie.title}</strong> is confirmed. </p>
                    <p>
                    <strong>Date:</strong> ${new Date(booking.show.showDateTime).toLocaleDateString('es-US', { timeZone: 'India/Bihar' })}
                    </p>
                    <p>Enjoy the show!🍿🍿</p>
                    <p>Thanks for booking with us!🌟 <br />- <span className='w-32 h-auto text-xl'> Movie<span className='text-pink-600'>Mate</span>🎬</span></p>
                </div>
            `
        })
    }
)

// Create an empty array where we'll export future Inngest functions
export const functions = [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdation,
    releaseSeatsAndDeleteBooking,
    sendBookingConfirmationEmail
];
