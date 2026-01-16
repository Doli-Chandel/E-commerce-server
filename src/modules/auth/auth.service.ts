import { AppDataSource } from '../../config/datasource';
import { User, UserRole } from '../../entities/User';
import { hashPassword, comparePassword } from '../../utils/password';
import { generateToken } from '../../utils/jwt';
import { AppError } from '../../middlewares/error.middleware';

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);

  async register(name: string, email: string, password: string): Promise<{ user: User; token: string }> {
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    const hashedPassword = await hashPassword(password);
    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      role: UserRole.USER,
      isActive: true,
    });

    await this.userRepository.save(user);

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, token };
  }

  async createAdmin(name: string, email: string, password: string): Promise<User> {
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    const hashedPassword = await hashPassword(password);
    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      role: UserRole.ADMIN,
      isActive: true,
    });

    await this.userRepository.save(user);
    return user;
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    if (!user.isActive) {
      throw new AppError('Account is inactive', 403);
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, token };
  }

  async resetPassword(email: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await this.userRepository.save(user);
  }

  async updateProfile(userId: string, data: { name?: string; email?: string }): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (data.email && data.email !== user.email) {
      const existingUser = await this.userRepository.findOne({ where: { email: data.email } });
      if (existingUser) {
        throw new AppError('Email already in use', 400);
      }
      user.email = data.email;
    }

    if (data.name) {
      user.name = data.name;
    }

    await this.userRepository.save(user);
    return user;
  }

  async updatePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const isPasswordValid = await comparePassword(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new AppError('Current password is incorrect', 400);
    }

    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await this.userRepository.save(user);
  }
}
