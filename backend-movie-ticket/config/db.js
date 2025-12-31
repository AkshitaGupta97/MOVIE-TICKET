import mongoose from "mongoose";

const connectDB = async() => {
    try {
       // mongoose.connection.on('connected', () => console.log("Database connected"))
        await mongoose.connect(`${process.env.MONGODB_URI}/movieTicket`)
        //await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database connected...")
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}
export default connectDB