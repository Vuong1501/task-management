const mongoose = require("mongoose");
module.exports.connect = async () => {
    console.log(process.env.MONGO_URL);
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connect Success!");
    } catch (error) {
        console.log("Connect Error!");
    }
};
