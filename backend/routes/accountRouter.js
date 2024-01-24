const express = require("express");
const Account = require("../schema/accountSchema");
const mongoose = require("mongoose");
const router = express.Router();

router.get("/balance", async function (req, res) {
    try {
        const userId = req.userId;

        const account = await Account.findOne({ userId })

        if (!account) {
            return res.status(404).json({ msg: "account not found" });
        }

        res.status(200).json({ balance: account.balance });

    } catch (e) {
        console.log(e.message);
        res.status(401).send({ error: "internal server error" });
    }
})
router.post("/transfer", async function (req, res) {
    const { to, amount } = req.body;
    const { userId } = req;

    if (!to || !amount || amount <= 0) {
        return res.status(400).json({ error: "Invalid amount" });
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const senderAccount = await Account.findOne({ userId }).session(session);

        if (!senderAccount || senderAccount.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Insufficient balance" });
        }

        const receiverAccount = await Account.findOne({ userId: to }).session(session);

        if (!receiverAccount) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Invalid recipient account" });
        }

        await Account.updateOne({ userId }, { $inc: { balance: -amount } }).session(session);
        await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

        await session.commitTransaction();

        return res.json({
            message: "Transfer successful"
        });
    } catch (error) {
        console.error(error);
        await session.abortTransaction();
        return res.status(500).json({ message: "Internal Server Error" });
    } finally {
        session.endSession();
    }
});

module.exports = router;