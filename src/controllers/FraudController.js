import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class FraudController{
    getAllFraud = async (req,res) => {
        try {
            const allFraud = await prisma.detections.findMany({
                select: {
                    detection_id: true,
                    user_id: true,
                    text_input: true,
                    result: true,
                    image_input: true,
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
}

export default new FraudController();