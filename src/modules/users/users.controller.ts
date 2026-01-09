import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { UsersService } from './users.service';
import { sendSuccess } from '../../utils/response';
import { AppError } from '../../middlewares/error.middleware';

export class UsersController {
  private usersService = new UsersService();

  getCurrentUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const user = await this.usersService.getUserById(req.user.id);
      
      sendSuccess(res, 'User details retrieved successfully', {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    } catch (error) {
      next(error);
    }
  };

  getAllUsers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const result = await this.usersService.getAllUsers(page, limit);
      
      const users = result.users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }));

      sendSuccess(res, 'Users retrieved successfully', {
        users,
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

  getUserById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await this.usersService.getUserById(id);
      
      sendSuccess(res, 'User retrieved successfully', {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    } catch (error) {
      next(error);
    }
  };

  createUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email, password, role } = req.body;
      const user = await this.usersService.createUser({ name, email, password, role });
      
      sendSuccess(res, 'User created successfully', {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      }, 201);
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, email, role, isActive } = req.body;
      const user = await this.usersService.updateUser(id, { name, email, role, isActive });
      
      sendSuccess(res, 'User updated successfully', {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        updatedAt: user.updatedAt,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.usersService.deleteUser(id);
      sendSuccess(res, 'User deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}
