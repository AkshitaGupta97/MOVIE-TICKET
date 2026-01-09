import { Inngest } from "inngest";
import User from "../modals/User.js";
import connectDB from "../config/db.js";
import Booking from "../modals/Booking.js"
import Show from "../modals/Show.js"
import User from "../modals/User.js";
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
);

// inngest function to send remainder
const sendShowRemainder = inngest.createFunction(
    { id: "send-show-remainders" },
    { cron: "0 */8 * * *" }, // in every 8 hours
    async ({ step }) => {
        const now = new Date();
        const in8Hours = new Date(now.getTime() + 8 * 60 * 60 * 1000);
        const windowStart = new Date(in8Hours.getTime() - 10 * 60 * 1000);

        // prepaid remainder tasks
        const remainderTasks = await step.run(
            "prepaid-remainder-tasks", async () => {
                const shows = await Show.find({
                    showTime: { $gte: windowStart, $lte: in8Hours },
                }).populate('movie');

                const tasks = [];
                for (const show of shows) {
                    if (!show.movie || !show.occupiedSeats) continue;
                    const userIds = [...new Set(Object.values(show.occupiedSeats))];
                    if (userIds.length === 0) continue;

                    const users = await User.find({ _id: { $in: userIds } }).select("name email");
                    for (const user of users) {
                        tasks.push({
                            userEmail: user.email,
                            userName: user.name,
                            movieTitle: show.movie.title,
                            showTime: show.showTime
                        })
                    }
                }
                return tasks;
            }
        )
        if (remainderTasks.length === 0) {
            return { sent: 0, message: "No remainder to send" }
        }
        // send remainder emails
        const results = await step.run('send-all-remainders', async () => {
            remainderTasks.map(task => sendEmail({
                to: task.userEmail,
                subject: `Remainder: Your movie "${task.movieTitle}" starts soon!`,
                body: `
                    <div>
                        <h2>Hello ${task.userName},</h2>
                        <p>🎟️This is a quick remainder that your movie:</p>
                        <h3 className="text-amber-300">"${task.movieTitle}"</h3>
                        <p>
                            is scheduled for <strong>${new Date(task.showTime).toLocaleDateString('es-US', { timeZone: 'Asia/India' })}</strong>
                            at <strong>${new Date(task.showTime).toLocaleTimeString('en-US', { timeZone: 'Asia/India' })}</strong>
                        </p>
                        <p>It starys in approximately <strong>8 hours</strong>-make sure you're ready!</p>
                        <br />
                        <p>Enjoy the Show🍿🍿 @ <span className='w-32 h-auto text-xl'> Movie<span className='text-pink-600'>Mate</span>🎬</span></p>
                    </div>
                `
            }))
        })
        const sent = results.filter(r => r.status === 'fulfilled').length;
        const  failed = results.length - sent;

        return {
            sent, failed,
            message: `Sent ${sent} remainder(s), ${failed} failed.`
        }

    }
);
 // adding function for new show notification, when uploaded by admin
const sendNewShowNotifications = inngest.createFunction(
    {id: "send-new-show-notifications"},
    {event: "app/show.added"},
    async ({event}) => {
        const {movieTitle, movieId} = event.data;
        const users = await User.find({});

        for(const user of users){
            const userEmail = user.email;
            const userName = user.name;

            const subject = `🎬 New Show Added: ${movieTitle}`;
            const body = `<div className="font-bold p-1">
                    <h2>Hi ${userName},</h2>
                    <p>We've just added a new shop to our libraray:</p>
                    <h3 className="text-pink-600">"${movieTitle}"</h3>
                    <p>Visit our website</p>
                    <br />
                    <p>Thanks,-  <br /><span className='w-32 h-auto text-xl'> Movie<span className='text-pink-600'>Mate</span>🎬</span></p>
                    </div>
                `
            await sendEmail({
                to: userEmail,
                subject,
                body,
            })
        }
        return {message: "Notification sent"}
    }
)

// Create an empty array where we'll export future Inngest functions
export const functions = [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdation,
    releaseSeatsAndDeleteBooking,
    sendBookingConfirmationEmail,
    sendShowRemainder,
    sendNewShowNotifications
];
