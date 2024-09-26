import { user as UserModel } from "../models/user.js";  // Renombrar la importación
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (user) => {
    return jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

///api/v1/users/register
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                ok: false,
                msg: "Missing required fields"
            });
        }

        const existingUser = await UserModel.findOneByEmail(email);
        if (existingUser) {
            return res.status(409).json({
                ok: false,
                msg: "Email already registered"
            });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = await UserModel.create({ email, password: hashedPassword, username });

        const token = generateToken(newUser);

        return res.status(201).json({ ok: true, token });

    } catch (err) {
        console.error(err);
        const isDev = process.env.NODE_ENV !== 'production';
        return res.status(500).json({
            ok: false,
            msg: isDev ? err.message : "Server Error"
        });
    }
};

///api/v1/users/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                ok: false,
                msg: "Missing required fields"
            });
        }

        const user = await UserModel.findOneByEmail({ email });
        if (!user) {
            return res.status(404).json({
                ok: false,
                msg: "User not found"
            });
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                ok: false,
                msg: "Invalid credentials" 
            });
        }

        const token = generateToken(user);

        return res.status(200).json({ ok: true, token });

    } catch (err) {
        console.error(err);
        
        return res.status(500).json({
            ok: false,
            msg: "Server Error"
        });
    }
};


const profile = async (req, res) =>{
    try{
        
        //const user = await UserModel.findOneByEmail(email??);
        const user = await UserModel.findOneByEmail(req.email) 
        return res.json({ ok: true, msg: user });
    }catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: "Server Error"
        });
    }
}


export const userController = {
    register,
    login,
    profile
};
