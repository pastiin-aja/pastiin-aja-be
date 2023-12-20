import { PrismaClient } from "@prisma/client"
import crypto from "crypto"
import axios from "axios"

const prisma = new PrismaClient()

class FraudController{
    getAllFraud = async (req,res) => {
        try {
            const allFraud = await prisma.frauds.findMany({
                select: {
                    fraud_id: true,
                    user_id: true,
                    text_input: true,
                    result: true,
                    image_input: true,
                    is_shared: true,
                    created_at: true,
                }
            })
            res.json({
                isError: false,
                message: "Get all fraud success",
                data: allFraud,
            })
        } catch (error) {
            res.status(500).json({
                isError: true,
                message: error.message,
                data: null,
            })
        }
    }

    postFraudPhoto = async (req,res) => {
        try {
            const { user_id, image_input, is_shared } = req.body;

            const current_date = new Date().valueOf().toString();
            const fraud_id = crypto
                .createHash("sha3-256")
                .update(current_date + user_id)
                .digest("hex");

            const mlResponse = await axios.post(process.env.FRAUD_DETECTION_URL + "/image_predict", {
                url: image_input,
            })

            console.log(mlResponse.data.prediction)

            const fraud = await prisma.frauds.create({
                data: {
                    user_id: user_id,
                    fraud_id: fraud_id,
                    text_input: mlResponse.data.text,
                    result: mlResponse.data.prediction,
                    image_input: image_input,
                    is_shared: is_shared,
                }
            })
            res.json({
                isError: false,
                message: "Post fraud image success",
                data: fraud,
            })
        } catch (error) {
            res.status(500).json({
                isError: true,
                message: error.message,
                data: null,
            })
        }
    }

    postFraudText = async (req,res) => {
        try {
            const { user_id, text_input, is_shared } = req.body;
            
            const current_date = new Date().valueOf().toString();
            const fraud_id = crypto
                .createHash("sha3-256")
                .update(current_date + user_id)
                .digest("hex");

            const mlResponse = await axios.post(process.env.FRAUD_DETECTION_URL + "/text_predict", {
                text: text_input,
            })

            const fraud = await prisma.frauds.create({
                data: {
                    user_id: user_id,
                    fraud_id: fraud_id,
                    text_input: text_input,
                    result: mlResponse.data.msg[0][0],
                    is_shared: is_shared,
                }
            })
            res.json({
                isError: false,
                message: "Post fraud text success",
                data: fraud,
            })
        } catch (error) {
            res.status(500).json({
                isError: true,
                message: error.message,
                data: null,
            })
        }
    }

    getFraudByFraudId = async (req,res) => {
        try {
            const { id } = req.params;
            const fraud = await prisma.frauds.findUnique({
                where: {
                    fraud_id: id,
                }
            })
            res.json({
                isError: false,
                message: "Get fraud by id success",
                data: fraud,
            })
        } catch (error) {
            res.status(500).json({
                isError: true,
                message: error.message,
                data: null,
            })
        }
    }
    getFraudByUserId = async (req,res) => {
        try {
            const { id } = req.params;
            const fraud = await prisma.frauds.findMany({
                where: {
                    user_id: id,
                }
            })
            res.json({
                isError: false,
                message: "Get fraud by user id success",
                data: fraud,
            })
        } catch (error) {
            res.status(500).json({
                isError: true,
                message: error.message,
                data: null,
            })
        }
    }
}

export default new FraudController()