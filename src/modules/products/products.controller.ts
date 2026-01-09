import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { ProductsService } from './products.service';
import { sendSuccess } from '../../utils/response';
import { AppError } from '../../middlewares/error.middleware';

export class ProductsController {
  private productsService = new ProductsService();

  getAllProducts = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const search = req.query.search as string | undefined;
      // If user is admin, show all products. Otherwise, only show visible products
      const isVisible = req.user && req.user.role === 'ADMIN' ? undefined : true;
      
      const result = await this.productsService.getAllProducts(page, limit, search, isVisible);
      
      const products = result.products.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        purchasePrice: parseFloat(product.purchasePrice.toString()),
        salePrice: parseFloat(product.salePrice.toString()),
        margin: parseFloat(product.margin.toString()),
        stock: product.stock,
        isVisible: product.isVisible,
        images: product.images,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      }));

      sendSuccess(res, 'Products retrieved successfully', {
        products,
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

  getProductById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const product = await this.productsService.getProductById(id);
      
      // If user is not admin and product is not visible, return 404
      if (!req.user || req.user.role !== 'ADMIN') {
        if (!product.isVisible) {
          throw new AppError('Product not found', 404);
        }
      }
      
      sendSuccess(res, 'Product retrieved successfully', {
        id: product.id,
        name: product.name,
        description: product.description,
        purchasePrice: parseFloat(product.purchasePrice.toString()),
        salePrice: parseFloat(product.salePrice.toString()),
        margin: parseFloat(product.margin.toString()),
        stock: product.stock,
        isVisible: product.isVisible,
        images: product.images,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      });
    } catch (error) {
      next(error);
    }
  };

  createProduct = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, description, purchasePrice, salePrice, stock, isVisible } = req.body;
      const product = await this.productsService.createProduct({
        name,
        description,
        purchasePrice,
        salePrice,
        stock,
        isVisible,
      });
      
      sendSuccess(res, 'Product created successfully', {
        id: product.id,
        name: product.name,
        description: product.description,
        purchasePrice: parseFloat(product.purchasePrice.toString()),
        salePrice: parseFloat(product.salePrice.toString()),
        margin: parseFloat(product.margin.toString()),
        stock: product.stock,
        isVisible: product.isVisible,
        images: product.images,
        createdAt: product.createdAt,
      }, 201);
    } catch (error) {
      next(error);
    }
  };

  updateProduct = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, description, purchasePrice, salePrice, stock, isVisible } = req.body;
      const product = await this.productsService.updateProduct(id, {
        name,
        description,
        purchasePrice,
        salePrice,
        stock,
        isVisible,
      });
      
      sendSuccess(res, 'Product updated successfully', {
        id: product.id,
        name: product.name,
        description: product.description,
        purchasePrice: parseFloat(product.purchasePrice.toString()),
        salePrice: parseFloat(product.salePrice.toString()),
        margin: parseFloat(product.margin.toString()),
        stock: product.stock,
        isVisible: product.isVisible,
        images: product.images,
        updatedAt: product.updatedAt,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteProduct = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.productsService.deleteProduct(id);
      sendSuccess(res, 'Product deleted successfully');
    } catch (error) {
      next(error);
    }
  };

  updateVisibility = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { isVisible } = req.body;
      const product = await this.productsService.updateVisibility(id, isVisible);
      
      sendSuccess(res, 'Product visibility updated successfully', {
        id: product.id,
        isVisible: product.isVisible,
      });
    } catch (error) {
      next(error);
    }
  };

  updateStock = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { stock } = req.body;
      const product = await this.productsService.updateStock(id, stock);
      
      sendSuccess(res, 'Product stock updated successfully', {
        id: product.id,
        stock: product.stock,
      });
    } catch (error) {
      next(error);
    }
  };

  uploadImage = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.file) {
        throw new Error('No file uploaded');
      }

      const { id } = req.params;
      const imagePath = `/uploads/${req.file.filename}`;
      const product = await this.productsService.addImage(id, imagePath);
      
      sendSuccess(res, 'Image uploaded successfully', {
        id: product.id,
        images: product.images,
      });
    } catch (error) {
      next(error);
    }
  };
}
