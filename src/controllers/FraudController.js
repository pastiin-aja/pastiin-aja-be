import { PrismaClient } from "@prisma/client"
import crypto from "crypto"
import axios from "axios"
import { Storage } from "@google-cloud/storage"

const prisma = new PrismaClient()

class FraudController{
    base64ToBlob = async (base64, contentType) => {
        try {
            contentType = contentType || '';

            // Remove data URL prefix if present
            const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');

            // Decode base64 string into a Buffer
            const buffer = Buffer.from(base64Data, 'base64');

            return buffer;
        } catch (error) {
            console.error('Error converting base64 to Blob:', error);
            throw error; // Re-throw the error for further handling
        }
    }

    uploadToBucket = async (buffer, fileName) => {
        try {
            const storage = new Storage({
                keyFilename: 'service-account.json',
                projectId: process.env.GCP_PROJECT_ID,
            });
            const bucket = storage.bucket(process.env.GCP_BUCKET_NAME);
            const folder = "fraud-images/"
            const file = bucket.file(folder + fileName);

            await file.save(buffer, {
                metadata: { contentType: 'image/png' },
            });
            await file.makePublic();
            //get the url
            const data = await file.getMetadata();
            const link = data[0].mediaLink;
            return link;          
        } catch (error) {
            console.error('Upload failed:', error);
            throw new Error('File upload to GCP bucket failed'); // Throw a custom error
        }
      };

    getAllFraud = async (req,res) => {
        try {
            const allFraud = await prisma.frauds.findMany({
                select: {
                    fraud_id: true,
                    user_id: true,
                    text_input: true,
                    result: true,
                    image_link: true,
                    is_shared: true,
                    created_at: true,
                },
                orderBy: {
                    created_at: 'desc',
                },
                take: 50,
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
    getAllSharedFraud = async (req,res) => {
        try {
            const allFraud = await prisma.frauds.findMany({
                where: {
                    is_shared: true,
                },
                select: {
                    fraud_id: true,
                    user_id: true,
                    text_input: true,
                    result: true,
                    image_link: true,
                    is_shared: true,
                    created_at: true,
                },
                orderBy: {
                    created_at: 'desc',
                },
                take: 50,
            })
            res.json({
                isError: false,
                message: "Get all shared fraud success",
                data: allFraud,
            })
        }
        catch (error) {
            res.status(500).json({
                isError: true,
                message: error.message,
                data: null,
            })
        }
    }
    
    postFraudPhoto = async (req,res) => {
        try {
            const { user_id, image_base64, is_shared } = req.body;

            const current_date = new Date().valueOf().toString();
            const fraud_id = crypto
                .createHash("sha3-256")
                .update(current_date + user_id)
                .digest("hex");
            const blob = await this.base64ToBlob(image_base64, "image/png")

            const image_link = await this.uploadToBucket(blob, fraud_id + ".png")
            
            const mlResponse = await axios.post(process.env.FRAUD_DETECTION_URL + "/image_predict", {
                url: image_link,
            })

            const fraud = await prisma.frauds.create({
                data: {
                    user_id: user_id,
                    fraud_id: fraud_id,
                    text_input: mlResponse.data.text,
                    result: mlResponse.data.prediction,
                    image_link: image_link,
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
    updateIsShared = async (req,res) => {
        try {
            const { fraud_id, is_shared } = req.body;
            const fraud = await prisma.frauds.update({
                where: {
                    fraud_id: fraud_id,
                },
                data: {
                    is_shared: is_shared,
                }
            })
            res.json({
                isError: false,
                message: "Update is_shared success",
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