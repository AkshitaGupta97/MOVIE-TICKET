import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from "./config/db.js";
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"
import dotenv from "dotenv"
import showRouter from "./routes/showRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import adminRouter from "./routes/adminRoute.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
const port = 3000;

dotenv.config();

const startServer = async () => {
    // add database
    await connectDB();

    // middleware
    app.use(express.json());
    app.use(cors()); // helps to easily connect api from frontend to backend 
    // adding clerk
    app.use(clerkMiddleware());

    // api routes
    app.get('/', (req, res) => res.send('Server is live'));
    //API-ROUTES
    // Set up the "/api/inngest" (recommended) routes with the serve handler
    app.use("/api/inngest", serve({ client: inngest, functions }));

    // show routes
    app.use('/api/show', showRouter);
    // booking Router
    app.use('/api/booking', bookingRouter);
    // admin router
    app.use('/api/admin', adminRouter);
    // user router
    app.use('/api/user', userRouter);

    app.listen(port, () => console.log(`server is at http://localhost:${port}`));
}
startServer();
//nodemon =>  helps to restart the server when we make any changes [npm run server]
// mongodb+srv://AkshitaGuptaProjects:<db_password>@cluster0.eqxxxzn.mongodb.net/?appName=Cluster0  pass-> movieTicket90
