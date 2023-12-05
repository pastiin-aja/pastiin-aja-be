import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
class ContohController {
    getAllUser = async (req, res, ) => {
        try {
            const allUser = await prisma.users.findMany({
                select: {
                    user_id: true,
                    username: true,
                    email: true,
                    password: true,
                    role: true,
                    created_at: true,
                }
            });
            res.json({
                isError: false,
                message: "Get all user success",
                data: allUser,
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

export default new ContohController();