import { Router } from "express"
import UserController from "../controllers/UserController"

class UserRoutes {
    constructor() {
        this.router = Router()
        this.router.get("/:user_id", UserController.getUserById)
    }
}

export default new UserRoutes().router