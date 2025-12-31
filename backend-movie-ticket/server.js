import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from "./config/db.js";
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"
import dotenv from "dotenv"

const app = express();
const port = 3000;

dotenv.config();

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

app.listen(port, () => console.log(`server is at http://localhost:${port}`));

//nodemon =>  helps to restart the server when we make any changes [npm run server]
// mongodb+srv://AkshitaGuptaProjects:<db_password>@cluster0.eqxxxzn.mongodb.net/?appName=Cluster0  pass-> movieTicket90
