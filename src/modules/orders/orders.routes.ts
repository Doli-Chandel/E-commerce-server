import { Router } from 'express';
import { OrdersController } from './orders.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { requireAdmin } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validate.middleware';
import {
  createOrderSchema,
  getOrdersSchema,
  proceedOrderSchema,
  cancelOrderSchema,
} from './orders.schemas';

const router = Router();
const ordersController = new OrdersController();

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Place a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: string
 *                       format: uuid
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *     responses:
 *       201:
 *         description: Order placed successfully
 *       400:
 *         description: Validation error or insufficient stock
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/',
  authMiddleware,
  validate(createOrderSchema),
  ordersController.createOrder
);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders (Admin only)
 *     tags: [Orders]
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
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PLACED, PROCEEDED, CANCELLED]
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *       403:
 *         description: Admin access required
 */
router.get(
  '/',
  authMiddleware,
  requireAdmin,
  validate(getOrdersSchema),
  ordersController.getAllOrders
);

/**
 * @swagger
 * /api/orders/{id}/proceed:
 *   patch:
 *     summary: Proceed an order (Admin only)
 *     tags: [Orders]
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
 *         description: Order proceeded successfully
 *       400:
 *         description: Order cannot be proceeded
 *       403:
 *         description: Admin access required
 */
router.patch(
  '/:id/proceed',
  authMiddleware,
  requireAdmin,
  validate(proceedOrderSchema),
  ordersController.proceedOrder
);

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   patch:
 *     summary: Cancel an order (Admin only)
 *     tags: [Orders]
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
 *         description: Order cancelled successfully
 *       400:
 *         description: Order cannot be cancelled
 *       403:
 *         description: Admin access required
 */
router.patch(
  '/:id/cancel',
  authMiddleware,
  requireAdmin,
  validate(cancelOrderSchema),
  ordersController.cancelOrder
);

export default router;
