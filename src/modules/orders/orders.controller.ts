import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { OrdersService } from './orders.service';
import { sendSuccess } from '../../utils/response';
import { AppError } from '../../middlewares/error.middleware';

export class OrdersController {
  private ordersService = new OrdersService();

  createOrder = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const { items } = req.body;
      const order = await this.ordersService.createOrder(req.user.id, items);
      
      const orderResponse = {
        id: order.id,
        userId: order.userId,
        status: order.status,
        totalAmount: parseFloat(order.totalAmount.toString()),
        orderItems: order.orderItems.map((item) => ({
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
          price: parseFloat(item.price.toString()),
          product: {
            id: item.product.id,
            name: item.product.name,
          },
        })),
        createdAt: order.createdAt,
      };

      sendSuccess(res, 'Order placed successfully', orderResponse, 201);
    } catch (error) {
      next(error);
    }
  };

  getAllOrders = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const status = req.query.status as string | undefined;
      
      const result = await this.ordersService.getAllOrders(page, limit, status as any);
      
      const orders = result.orders.map((order) => ({
        id: order.id,
        userId: order.userId,
        user: order.user ? {
          id: order.user.id,
          name: order.user.name,
          email: order.user.email,
        } : undefined,
        status: order.status,
        totalAmount: parseFloat(order.totalAmount.toString()),
        orderItems: order.orderItems.map((item) => ({
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
          price: parseFloat(item.price.toString()),
          product: {
            id: item.product.id,
            name: item.product.name,
          },
        })),
        createdAt: order.createdAt,
      }));

      sendSuccess(res, 'Orders retrieved successfully', {
        orders,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: Math.ceil(result.total / result.limit),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  proceedOrder = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const order = await this.ordersService.proceedOrder(id);
      
      const orderResponse = {
        id: order.id,
        userId: order.userId,
        status: order.status,
        totalAmount: parseFloat(order.totalAmount.toString()),
        orderItems: order.orderItems.map((item) => ({
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
          price: parseFloat(item.price.toString()),
        })),
        updatedAt: order.createdAt,
      };

      sendSuccess(res, 'Order proceeded successfully', orderResponse);
    } catch (error) {
      next(error);
    }
  };

  cancelOrder = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const order = await this.ordersService.cancelOrder(id);
      
      const orderResponse = {
        id: order.id,
        userId: order.userId,
        status: order.status,
        totalAmount: parseFloat(order.totalAmount.toString()),
        orderItems: order.orderItems.map((item) => ({
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
          price: parseFloat(item.price.toString()),
        })),
        updatedAt: order.createdAt,
      };

      sendSuccess(res, 'Order cancelled successfully', orderResponse);
    } catch (error) {
      next(error);
    }
  };
}
