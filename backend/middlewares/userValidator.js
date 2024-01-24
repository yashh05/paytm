const zod = require("zod")

const signupSchema = zod.object({
    username: zod.string().min(2, "Enter Username."),
    firstname: zod.string().min(2, "Enter First Name."),
    lastname: zod.string().min(2, "Enter Last Name."),
    password: zod.string().min(6, "password should be atleast 6 digits long."),
})

const updateUserSchema = zod.object({
    firstname: zod.string().optional(),
    lastname: zod.string().optional(),
    password: zod.string().min(6, "password is small").optional(),
})

const signinSchema = zod.object({
    username: zod.string().min(2, "Enter Username."),
    password: zod.string().min(6, "password should be atleast 6 digits long."),
})

function signupValidator(req, res, next) {
    const result = signupSchema.safeParse(req.body);
    if (result.error) {
        return res.status(400).json({ error: result.error });
    }
    req.validUserData = result.data;
    next();
}


function signinValidator(req, res, next) {
    const result = signinSchema.safeParse(req.body);
    if (result.error) {
        return res.status(400).json({ error: result.error });
    }
    req.validUserData = result.data;
    next();
}

function updateUserValidation(req, res, next) {
    const result = updateUserSchema.safeParse(req.body);
    if (result.error) {
        return res.status(400).json(result.error);
    }
    req.validUserData = result.data;
    next();
}

module.exports = { signupValidator, signinValidator, updateUserValidation }