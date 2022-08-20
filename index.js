require("./db/db");
const express = require("express");
const helmet = require("helmet");
const dotenv = require("dotenv");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

//Initializing express
const app = express();

//dotenv
dotenv.config();

//Secure http
app.use(helmet());

//For form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Router base get api
app.use("/api/posts", postRoute);
app.use("/api/users",userRoute);
app.use("/api/auth",authRoute);

//Base get api
app.get("/", (req, res) => {
    res.send("hellooo");
})

//Starting the server
app.listen(3000, () => {
    console.log("Server is running on port 3000");
})