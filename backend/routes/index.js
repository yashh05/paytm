require('dotenv').config();

const express = require("express")
const userRouter = require("./userRouter")
const accountRouter = require("./accountRouter");

const { authMiddleware } = require("../middlewares/auth");
const router = express.Router();


router.use("/user", userRouter);
router.use("/account", authMiddleware, accountRouter);
module.exports = router;