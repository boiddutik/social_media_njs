import { app } from "./app.js";
import connectDB from "./db/index.js";

console.log("Loaded PORT:", process.env.PORT);

const PORT = process.env.PORT || 8001;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running at port ${PORT}`)
    });
}).catch((err) => {
    console.log(`MongoDB connection error: ${err}`)
})