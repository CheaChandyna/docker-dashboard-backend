import { Router } from "express";
import { createUser, deleteUser, getUser, getUsers, resetPassword, updateUser } from "./user.controller";
import authenticateGuard from "../auth/auth.guard";

const router = Router()

router.use(authenticateGuard)

router.get('/', getUsers)
router.get('/:id', getUser)
router.post('/', createUser)
router.patch('/:id', updateUser)
router.delete('/:id', deleteUser)
router.patch('/:id/reset-password', resetPassword)

export default router