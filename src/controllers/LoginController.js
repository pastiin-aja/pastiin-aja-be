import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import AccessTokenModel from "../models/AccessTokenModel.js";

const prisma = new PrismaClient();

class LoginController {
  login = async (req, res) => {
    const { email, password } = req.body;

    //check if email exist
    const checkEmail = await prisma.users.findUnique({
      select: {
        user_id: true,
        name: true,
        username: true,
        password: true,
        email: true
      },
      where: {
        email: email,
      },
    });

    if (!checkEmail) {
      return res.status(400).json({
        isError: true,
        message: "Email not registered",
        data: null,
      });
    }

    //check if password match
    const checkPassword = await bcrypt.compare(
      password,
      checkEmail.password
    );

    if (!checkPassword) {
      return res.status(400).json({
        isError: true,
        message: "Invalid password",
        data: null,
      });
    }

    //generate access token
    const accessToken = AccessTokenModel.generateAccessToken(checkEmail);

    //update user access token
    const updateUserAccessToken = await prisma.users.update({
      where: {
        user_id: checkEmail.user_id,
      },
      data: {
        access_token: accessToken,
      },
    });

    if (!updateUserAccessToken) {
      return res.status(400).json({
        isError: true,
        message: "Failed to update user access token",
        data: null,
      });
    }

    res.json({
      isError: false,
      message: "Login success",
      data: {
        user: checkEmail,
        access_token: accessToken,
      },
    });
  }
}

export default new LoginController();
