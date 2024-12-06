import mongoose from "mongoose"

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
        // console.log(`Connected to MongoDB - DBhost:${connectionInstance.connection.host}`);
        console.log(`Connected to MongoDB - ${process.env.MONGODB_URI}`);
    } catch (err) {
        console.log('Error connecting to MongoDB:', err);
        process.exit(1);
    }
};

export default connectDB;