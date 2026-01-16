import { AppDataSource } from '../../config/datasource';
import { Product } from '../../entities/Product';
import { AppError } from '../../middlewares/error.middleware';
import { Like } from 'typeorm';

export class ProductsService {
  private productRepository = AppDataSource.getRepository(Product);

  async getAllProducts(page: number = 1, limit: number = 10, search?: string, isVisible?: boolean): Promise<{
    products: Product[];
    total: number;
    page: number;
    limit: number;
  }> {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.name = Like(`%${search}%`);
    }

    if (isVisible !== undefined) {
      where.isVisible = isVisible;
    }

    const [products, total] = await this.productRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { products, total, page, limit };
  }

  async getProductById(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    return product;
  }

  async createProduct(data: {
    name: string;
    description: string;
    purchasePrice: number;
    salePrice: number;
    stock: number;
    isVisible?: boolean;
    images?: string[];
  }): Promise<Product> {
    const margin = data.salePrice - data.purchasePrice;
    const product = this.productRepository.create({
      ...data,
      margin,
      isVisible: data.isVisible !== undefined ? data.isVisible : true,
      images: data.images || [],
    });

    return await this.productRepository.save(product);
  }

  async updateProduct(id: string, data: {
    name?: string;
    description?: string;
    purchasePrice?: number;
    salePrice?: number;
    stock?: number;
    isVisible?: boolean;
    images?: string[];
  }): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    if (data.name) product.name = data.name;
    if (data.description) product.description = data.description;
    if (data.purchasePrice !== undefined) product.purchasePrice = data.purchasePrice;
    if (data.salePrice !== undefined) product.salePrice = data.salePrice;
    if (data.stock !== undefined) product.stock = data.stock;
    if (data.isVisible !== undefined) product.isVisible = data.isVisible;
    if (data.images !== undefined) product.images = data.images;

    // Recalculate margin if prices changed
    if (data.purchasePrice !== undefined || data.salePrice !== undefined) {
      product.margin = product.salePrice - product.purchasePrice;
    }

    return await this.productRepository.save(product);
  }

  async deleteProduct(id: string): Promise<void> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    await this.productRepository.remove(product);
  }

  async updateVisibility(id: string, isVisible: boolean): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    product.isVisible = isVisible;
    return await this.productRepository.save(product);
  }

  async updateStock(id: string, stock: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    product.stock = stock;
    return await this.productRepository.save(product);
  }

  async addImage(id: string, imagePath: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    product.images = [...product.images, imagePath];
    return await this.productRepository.save(product);
  }
}
