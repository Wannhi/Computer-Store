import express from 'express';
import authAdminMiddleware from '../middleware/authAdminMiddleware.js';
import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/userManageController.js';

const router = express.Router();

router.route('/')
  .get(authAdminMiddleware, getUsers)
  .post(authAdminMiddleware, createUser);

router.route('/:id')
  .get(authAdminMiddleware, getUserById)
  .put(authAdminMiddleware, updateUser)
  .delete(authAdminMiddleware, deleteUser);

export default router;