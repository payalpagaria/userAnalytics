import app from "./app.js";
import connectDB from "./DB/connectDb.js";
const PORT=process.env.PORT || 3000;
connectDB()
.then(()=>{
    app.listen(PORT, () =>
        console.log("Server running on port 3000")
      );
})