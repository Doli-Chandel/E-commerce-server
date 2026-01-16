import { AppDataSource } from '../../config/datasource';
import { Order, OrderStatus } from '../../entities/Order';
import { OrderItem } from '../../entities/OrderItem';
import { Product } from '../../entities/Product';
import { Notification } from '../../entities/Notification';
import { AppError } from '../../middlewares/error.middleware';

export class OrdersService {
  private orderRepository = AppDataSource.getRepository(Order);
  private orderItemRepository = AppDataSource.getRepository(OrderItem);
  private productRepository = AppDataSource.getRepository(Product);
  private notificationRepository = AppDataSource.getRepository(Notification);

  async createOrder(userId: string, items: Array<{ productId: string; quantity: number }>): Promise<Order> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let totalAmount = 0;
      const orderItems: OrderItem[] = [];

      // Validate products and calculate total
      for (const item of items) {
        // Validate item structure
        if (!item.productId || !item.quantity) {
          throw new AppError('Invalid order item: productId and quantity are required', 400);
        }

        if (typeof item.quantity !== 'number' || item.quantity <= 0) {
          throw new AppError(`Invalid quantity for product ${item.productId}: must be a positive number`, 400);
        }

        const product = await queryRunner.manager.findOne(Product, {
          where: { id: item.productId },
        });

        if (!product) {
          throw new AppError(
            `Product with ID "${item.productId}" not found. ` +
            `This product may have been removed or the ID is incorrect. ` +
            `Please refresh the product list and try again.`,
            404
          );
        }

        if (!product.isVisible) {
          throw new AppError(`Product "${product.name}" is not available for purchase`, 400);
        }

        if (product.stock < item.quantity) {
          throw new AppError(`Insufficient stock for product ${product.name}`, 400);
        }

        const itemTotal = parseFloat(product.salePrice.toString()) * item.quantity;
        totalAmount += itemTotal;

        const orderItem = queryRunner.manager.create(OrderItem, {
          productId: product.id,
          quantity: item.quantity,
          price: parseFloat(product.salePrice.toString()),
        });

        orderItems.push(orderItem);
      }

      // Create order
      const order = queryRunner.manager.create(Order, {
        userId,
        status: OrderStatus.PLACED,
        totalAmount,
        orderItems,
      });

      const savedOrder = await queryRunner.manager.save(Order, order);

      // Save order items
      for (const orderItem of orderItems) {
        orderItem.orderId = savedOrder.id;
        await queryRunner.manager.save(OrderItem, orderItem);
      }

      // Create notification
      const notification = queryRunner.manager.create(Notification, {
        title: 'New Order Placed',
        message: `Order #${savedOrder.id.substring(0, 8)} has been placed with total amount of $${totalAmount.toFixed(2)}`,
        isRead: false,
      });
      await queryRunner.manager.save(Notification, notification);

      await queryRunner.commitTransaction();

      return await this.orderRepository.findOne({
        where: { id: savedOrder.id },
        relations: ['orderItems', 'orderItems.product', 'user'],
      }) as Order;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getAllOrders(page: number = 1, limit: number = 10, status?: OrderStatus): Promise<{
    orders: Order[];
    total: number;
    page: number;
    limit: number;
  }> {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (status) {
      where.status = status;
    }

    const [orders, total] = await this.orderRepository.findAndCount({
      where,
      relations: ['orderItems', 'orderItems.product', 'user'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { orders, total, page, limit };
  }

  async proceedOrder(id: string): Promise<Order> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await queryRunner.manager.findOne(Order, {
        where: { id },
        relations: ['orderItems', 'orderItems.product'],
      });

      if (!order) {
        throw new AppError('Order not found', 404);
      }

      if (order.status !== OrderStatus.PLACED) {
        throw new AppError('Only PLACED orders can be proceeded', 400);
      }

      // Decrease stock for each product
      for (const orderItem of order.orderItems) {
        const product = await queryRunner.manager.findOne(Product, {
          where: { id: orderItem.productId },
        });

        if (!product) {
          throw new AppError(`Product ${orderItem.productId} not found`, 404);
        }

        if (product.stock < orderItem.quantity) {
          throw new AppError(`Insufficient stock for product ${product.name}`, 400);
        }

        product.stock -= orderItem.quantity;
        await queryRunner.manager.save(Product, product);
      }

      order.status = OrderStatus.PROCEEDED;
      const savedOrder = await queryRunner.manager.save(Order, order);

      // Create notification
      const notification = queryRunner.manager.create(Notification, {
        title: 'Order Proceeded',
        message: `Order #${savedOrder.id.substring(0, 8)} has been proceeded`,
        isRead: false,
      });
      await queryRunner.manager.save(Notification, notification);

      await queryRunner.commitTransaction();

      return await this.orderRepository.findOne({
        where: { id: savedOrder.id },
        relations: ['orderItems', 'orderItems.product', 'user'],
      }) as Order;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async cancelOrder(id: string): Promise<Order> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await queryRunner.manager.findOne(Order, {
        where: { id },
        relations: ['orderItems', 'orderItems.product'],
      });

      if (!order) {
        throw new AppError('Order not found', 404);
      }

      if (order.status === OrderStatus.CANCELLED) {
        throw new AppError('Order is already cancelled', 400);
      }

      // If order was proceeded, increase stock back
      if (order.status === OrderStatus.PROCEEDED) {
        for (const orderItem of order.orderItems) {
          const product = await queryRunner.manager.findOne(Product, {
            where: { id: orderItem.productId },
          });

          if (product) {
            product.stock += orderItem.quantity;
            await queryRunner.manager.save(Product, product);
          }
        }
      }

      order.status = OrderStatus.CANCELLED;
      const savedOrder = await queryRunner.manager.save(Order, order);

      // Create notification
      const notification = queryRunner.manager.create(Notification, {
        title: 'Order Cancelled',
        message: `Order #${savedOrder.id.substring(0, 8)} has been cancelled`,
        isRead: false,
      });
      await queryRunner.manager.save(Notification, notification);

      await queryRunner.commitTransaction();

      return await this.orderRepository.findOne({
        where: { id: savedOrder.id },
        relations: ['orderItems', 'orderItems.product', 'user'],
      }) as Order;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
