import { Router } from 'express';
import { DashboardController } from './dashboard.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { requireAdmin } from '../../middlewares/role.middleware';

const router = Router();
const dashboardController = new DashboardController();

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     summary: Get dashboard summary (Admin only)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalOrders:
 *                   type: integer
 *                 totalRevenue:
 *                   type: number
 *                 totalProfit:
 *                   type: number
 *                 totalLoss:
 *                   type: number
 *       403:
 *         description: Admin access required
 */
router.get('/summary', authMiddleware, requireAdmin, dashboardController.getSummary);

/**
 * @swagger
 * /api/dashboard/charts:
 *   get:
 *     summary: Get dashboard charts data (Admin only)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *     responses:
 *       200:
 *         description: Dashboard charts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ordersPerDay:
 *                   type: array
 *                   items:
 *                     type: object
 *                 revenuePerDay:
 *                   type: array
 *                   items:
 *                     type: object
 *                 profitPerDay:
 *                   type: array
 *                   items:
 *                     type: object
 *       403:
 *         description: Admin access required
 */
router.get('/charts', authMiddleware, requireAdmin, dashboardController.getCharts);

export default router;
