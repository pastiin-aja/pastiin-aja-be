import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

class UserController {
    getUserById = async (req,res) => {
        try {
            const { user_id } = req.params;
            const user = await prisma.users.findUnique({
                where: {
                    user_id: user_id,
                }
            })
            res.json({
                isError: false,
                message: "Get user by id success",
                data: user,
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

export default new UserController()