import mongoose from "mongoose"

const connectDB = async () => {
    try {
        console.log("--------------------------------------")
        console.log(`${process.env.MONGODB_URI}`)
        console.log("--------------------------------------")
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Connected to MongoDB - DBhost:${connectionInstance.connection.host}`);
    } catch (err) {
        console.log('Error connecting to MongoDB:', err);
        process.exit(1);
    }
};

export default connectDB;