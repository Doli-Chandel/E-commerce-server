import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { NotificationsService } from './notifications.service';
import { sendSuccess } from '../../utils/response';

export class NotificationsController {
  private notificationsService = new NotificationsService();

  getAllNotifications = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const isRead = req.query.isRead === 'true' ? true : req.query.isRead === 'false' ? false : undefined;
      
      const result = await this.notificationsService.getAllNotifications(page, limit, isRead);
      
      const notifications = result.notifications.map((notification) => ({
        id: notification.id,
        title: notification.title,
        message: notification.message,
        isRead: notification.isRead,
        createdAt: notification.createdAt,
      }));

      sendSuccess(res, 'Notifications retrieved successfully', {
        notifications,
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

  markAsRead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const notification = await this.notificationsService.markAsRead(id);
      
      sendSuccess(res, 'Notification marked as read', {
        id: notification.id,
        isRead: notification.isRead,
      });
    } catch (error) {
      next(error);
    }
  };
}
