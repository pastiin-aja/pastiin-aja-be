import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import crypto from "crypto";

const prisma = new PrismaClient();

class RegisterController {
    userRegister = async (req, res) => {
        const { name, email, password } = req.body;

        const username = name.toLowerCase().split(" ").join("_") + Math.floor(Math.random() * 1000);
        const role = "USER"
        //check if email already exist
        const checkEmail = await prisma.users.findUnique({
            where: {
                email: email,
            }
        });

        if (checkEmail) {
            return res.status(400).json({
                isError: true,
                message: "Email already exist",
                data: null,
            })
        }

        //hash user_id
        const current_date = new Date().valueOf().toString();
        const user_id = crypto
          .createHash("sha3-256")
          .update(current_date + name)
          .digest("hex");
  
        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        try {
            const user = await prisma.users.create({
                data: {
                    user_id: user_id,
                    name: name,
                    username: username,
                    email: email,
                    password: hashPassword,
                    role: role
                }
            });
            res.json({
                isError: false,
                message: "Register success",
                data: user,
            })
        } catch (error) {
            res.status(500).json({
                isError: true,
                message: error.message || "Internal Server Error",
                data: null,
            })
        }
    }
}

export default new RegisterController();