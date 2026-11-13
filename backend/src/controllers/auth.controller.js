import { User } from "../models/user.model";

const registerUser = async (req, res) => {
    try {
        const { firstName, email, password } = req.body;
        if (!firstName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required!'
            });
        }

        const existedUser = await User.findOne({ email });
        if (existedUser) {
            return res.status(409).json({
                success: false,
                message: 'User already exist!'
            });
        }

        const newUser = await User.create({
            firstName,
            email,
            password
        });
        newUser.save();
        return res.status(201).json({
            success: true,
            message: 'New user registered!',
            user: {
                id: newUser._id,
                firstName: newUser.firstName,
                email: newUser.email
            }
        });
    } catch (error) {
        console.log('Error on registerUser controller: ', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error!'
        });
    }
};

const loginUser = async (req, res) => { };

export { registerUser, loginUser };