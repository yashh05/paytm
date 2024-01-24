const mongoose = require('mongoose')

async function dbConnect() {
    await mongoose.connect(process.env.DB_URI)
    console.log("connected to db");
}

module.exports = dbConnect