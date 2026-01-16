import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { AuthService } from './auth.service';
import { sendSuccess } from '../../utils/response';
import { AppError } from '../../middlewares/error.middleware';

export class AuthController {
  private authService = new AuthService();

  register = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email, password } = req.body;
      const { user, token } = await this.authService.register(name, email, password);
      
      const userResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      sendSuccess(res, 'User registered successfully', { user: userResponse, token }, 201);
    } catch (error) {
      next(error);
    }
  };

  createAdmin = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email, password } = req.body;
      const user = await this.authService.createAdmin(name, email, password);
      
      const userResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      };

      sendSuccess(res, 'Admin user created successfully', { user: userResponse }, 201);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log('login request', req.body);
      const { email, password } = req.body;
      const { user, token } = await this.authService.login(email, password);
      
      const userResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      sendSuccess(res, 'Login successful', { user: userResponse, token });
    } catch (error) {
      next(error);
    }
  };

  logout = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      sendSuccess(res, 'Logout successful');
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, newPassword } = req.body;
      await this.authService.resetPassword(email, newPassword);
      sendSuccess(res, 'Password reset successfully');
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const { name, email } = req.body;
      const user = await this.authService.updateProfile(req.user.id, { name, email });
      
      const userResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      sendSuccess(res, 'Profile updated successfully', { user: userResponse });
    } catch (error) {
      next(error);
    }
  };

  updatePassword = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const { oldPassword, newPassword } = req.body;
      await this.authService.updatePassword(req.user.id, oldPassword, newPassword);
      
      sendSuccess(res, 'Password updated successfully');
    } catch (error) {
      next(error);
    }
  };
}
