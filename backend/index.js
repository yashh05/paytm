const express = require("express");
const mainRouter = require("./routes/index")
const cors = require("cors");
const dbConnect = require("./db");

const app = express();

app.use(cors());
app.use(express.json())

dbConnect();

app.use("/api/v1", mainRouter);

app.listen(3000, () => {
    console.log("server is listening");
})

