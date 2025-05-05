import express from 'express';
import { adminLogin } from '../controllers/authAdminController.js';
import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/userManageController.js';


const router = express.Router();
router.post('/login', adminLogin);



export default router;

