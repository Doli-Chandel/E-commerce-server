import { Router } from 'express';
import { UsersController } from './users.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { requireAdmin } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validate.middleware';
import {
  createUserSchema,
  updateUserSchema,
  getUserSchema,
  deleteUserSchema,
  getUsersSchema,
} from './users.schemas';

const router = Router();
const usersController = new UsersController();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       403:
 *         description: Admin access required
 */
/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current user details (Authenticated users)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                       enum: [ADMIN, USER]
 *                     isActive:
 *                       type: boolean
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/me',
  authMiddleware,
  usersController.getCurrentUser
);

router.get(
  '/',
  authMiddleware,
  requireAdmin,
  validate(getUsersSchema),
  usersController.getAllUsers
);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       403:
 *         description: Admin access required
 *       404:
 *         description: User not found
 */
router.get(
  '/:id',
  authMiddleware,
  requireAdmin,
  validate(getUserSchema),
  usersController.getUserById
);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [ADMIN, USER]
 *     responses:
 *       201:
 *         description: User created successfully
 *       403:
 *         description: Admin access required
 */
router.post(
  '/',
  authMiddleware,
  requireAdmin,
  validate(createUserSchema),
  usersController.createUser
);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               role:
 *                 type: string
 *                 enum: [ADMIN, USER]
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User updated successfully
 *       403:
 *         description: Admin access required
 */
router.put(
  '/:id',
  authMiddleware,
  requireAdmin,
  validate(updateUserSchema),
  usersController.updateUser
);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       403:
 *         description: Admin access required
 */
router.delete(
  '/:id',
  authMiddleware,
  requireAdmin,
  validate(deleteUserSchema),
  usersController.deleteUser
);

export default router;
