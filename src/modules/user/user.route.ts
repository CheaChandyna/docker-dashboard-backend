import { Router } from "express";
import { createUser } from "./user.controller";
import authenticateGuard from "../auth/auth.guard";

const router = Router()

router.use(authenticateGuard)

router.post('/', createUser)

export default router