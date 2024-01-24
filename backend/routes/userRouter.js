const express = require("express");
const User = require("../schema/userSchema");
const Account = require("../schema/accountSchema");

const { signupValidator, signinValidator, updateUserValidation } = require("../middlewares/userValidator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("../middlewares/auth");

const router = express.Router();
const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET
router.get("/", function (req, res) {
    const allUsers = User.find({});
    res.status(200).json(allUsers);
})

router.post("/signup", signupValidator, async function (req, res) {
    try {
        const { username, firstname, lastname, password } = req.validUserData;

        const hash = await bcrypt.hash(password, saltRounds)

        const newUser = await User.create({ username, firstname, lastname, password: hash })
        const userId = newUser._id;

        await Account.create({ userId, balance: 1 + Math.random() * 10000 })

        const token = jwt.sign({
            userId
        }, JWT_SECRET);

        res.status(201).json({
            message: "new user created",
            token
        });
    } catch (error) {
        res.status(500).json({ error: { message: error.message, code: error.code } })
    }
})

router.post("/signin", signinValidator, async function (req, res) {
    try {
        const { username, password } = req.validUserData;
        const newUser = await User.findOne({ username });


        if (!newUser) {
            res.status(400).json({ error: "invalid username" });
            return;
        }

        const result = await bcrypt.compare(password, newUser.password);

        if (result) {
            const token = jwt.sign({
                userId: newUser._id
            }, JWT_SECRET)

            res.status(200).json({ token })
        } else {
            res.status(411).json({ error: 'Invalid Password' });
        }

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message })
    }
})

router.put("/", authMiddleware, updateUserValidation, async function (req, res) {
    try {
        const { firstname, lastname, password } = req.validUserData;

        const { userId } = req;

        const existingUser = await User.findById(userId);

        if (!existingUser) {
            return res.status(404).json({ error: "user not found" })
        }

        const updatedUser = await User.updateOne({ _id: userId }, {
            firstname: firstname || existingUser.firstname,
            lastname: lastname || existingUser.lastname,
            password: password ? bcrypt.hashSync(password, 8) : existingUser.password
        })

        res.status(200).json({ message: "user updated" })


    } catch (e) {
        console.log(e.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
})


router.get("/bulk", authMiddleware, async function (req, res) {
    const filter = req.query.filter || "";

    try {
        const { userId } = req;
        //Get all users except the current logged in user

        const filteredUsers = await User.find({
            _id: { $ne: userId },
            $or: [
                { firstname: { $regex: filter, $options: 'i' } },
                { lastname: { $regex: filter, $options: 'i' } }
            ]
        });


        const resultArray = filteredUsers.map((user) => ({
            id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            username: user.username
        }));

        res.status(200).json(resultArray);
    } catch (err) {
        console.error(err.message);
        res.status(400).json({ error: err.message });
    }
});

router.get("/info", authMiddleware, async (req, res) => {
    try {
        const { userId } = req;

        const existingUser = await User.findById(userId);

        if (!existingUser) {
            return res.status(404).json({ error: "user not found" })
        }

        const finalUser = {
            firstname: existingUser.firstname,
            lastname: existingUser.lastname,
            username: existingUser.username
        }

        res.status(200).json(finalUser)


    } catch (e) {
        console.log(e.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
})

module.exports = router;