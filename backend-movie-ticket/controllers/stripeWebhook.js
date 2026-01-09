import stripe from 'stripe';
import Booking from '../modals/Booking.js';

export const stripeWebhook = async (req, res) => {   // defines an Express route handler called stripewebhook. this function will be triggered when Stripe sends webhook events to your server.
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);   // Creates a stripe client using your secret key from environment variables. needed to verify and process events securely

    const signature = req.headers['stripe-signature']; // retrieves the signature from the request headers. this signature is used to verify that the webhook event is genuinely from Stripe and has not been tampered with.

    let event;  // declares a variable event that will hold the verified webhook event data.

    try {
        event = stripeInstance.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );  // uses the stripe library's constructEvent method to verify the webhook event using the request body, signature, and your webhook secret. if verification fails, an error will be thrown.
    }
    catch (error) {
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    try {
        switch (event.type) {
             case "payment_intent.succeeded": {
                 // Handle successful payment intent
                 const paymentIntent = event.data.object;
                 const sessionList = await stripeInstance.checkout.sessions.list({
                     payment_intent: paymentIntent.id,
                 })
                 const session = sessionList.data[0];
                 const {bookingId} = session.metadata;
 
                 await Booking.findByIdAndUpdate(bookingId, {
                     isPaid: true,
                     paymentLink: ""
                 })
                 // sendBookingConfirmationEmail  
                 await inngest.send({
                    name: "app/show.booked",
                    data: {bookingId}
                 })
                break;
             }
         
             default:
                 console.log(`Unhandled event type ${event.type}`);
        }

      /*  switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object;
                const { bookingId } = session.metadata;

                await Booking.findByIdAndUpdate(bookingId, {
                    isPaid: true,
                    paymentLink: ""
                });
                break;
            }

            default:
                console.log(`Unhandled event type ${event.type}`);
        }*/

        res.json({ received: true });
    } catch (error) {
        console.error("Webhook processing error", error);
        res.status(500).send('Internal Server Error');
    }

}
