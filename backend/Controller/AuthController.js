const admin = require("../model/db");


const signUp = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await admin.auth().createUser({
            email: email,
            password: password,
            emailVerified: false,
            disabled: false
        });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


module.exports = {
    signUp,
}