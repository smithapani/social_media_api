const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, cb) => {
    if (!err) {
        console.log("Mongodb connection succeded");
    }
    else {
        console.log("There is error in connection", err);
    }
})