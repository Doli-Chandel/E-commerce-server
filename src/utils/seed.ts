import 'reflect-metadata';
import { AppDataSource } from '../config/datasource';
import { User, UserRole } from '../entities/User';
import { Product } from '../entities/Product';
import { Order, OrderStatus } from '../entities/Order';
import { OrderItem } from '../entities/OrderItem';
import { Notification } from '../entities/Notification';
import { hashPassword } from './password';

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected successfully');

    const userRepository = AppDataSource.getRepository(User);
    const productRepository = AppDataSource.getRepository(Product);
    const orderRepository = AppDataSource.getRepository(Order);
    const orderItemRepository = AppDataSource.getRepository(OrderItem);
    const notificationRepository = AppDataSource.getRepository(Notification);

    // Clear existing data (order matters due to foreign keys)
    console.log('Clearing existing data...');
    
    // Delete in order to respect foreign key constraints
    const existingOrderItems = await orderItemRepository.find();
    if (existingOrderItems.length > 0) {
      await orderItemRepository.remove(existingOrderItems);
    }
    
    const existingOrders = await orderRepository.find();
    if (existingOrders.length > 0) {
      await orderRepository.remove(existingOrders);
    }
    
    const existingProducts = await productRepository.find();
    if (existingProducts.length > 0) {
      await productRepository.remove(existingProducts);
    }
    
    const existingNotifications = await notificationRepository.find();
    if (existingNotifications.length > 0) {
      await notificationRepository.remove(existingNotifications);
    }
    
    const existingUsers = await userRepository.find();
    if (existingUsers.length > 0) {
      await userRepository.remove(existingUsers);
    }

    // Create Admin Users
    console.log('Creating admin users...');
    const admin1 = userRepository.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: await hashPassword('admin123'),
      role: UserRole.ADMIN,
      isActive: true,
    });

    const admin2 = userRepository.create({
      name: 'Super Admin',
      email: 'superadmin@example.com',
      password: await hashPassword('admin123'),
      role: UserRole.ADMIN,
      isActive: true,
    });

    await userRepository.save([admin1, admin2]);

    // Create Regular Users
    console.log('Creating regular users...');
    const user1 = userRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: await hashPassword('user123'),
      role: UserRole.USER,
      isActive: true,
    });

    const user2 = userRepository.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: await hashPassword('user123'),
      role: UserRole.USER,
      isActive: true,
    });

    const user3 = userRepository.create({
      name: 'Bob Johnson',
      email: 'bob@example.com',
      password: await hashPassword('user123'),
      role: UserRole.USER,
      isActive: true,
    });

    const savedUsers = await userRepository.save([user1, user2, user3]);
    const allUsers = [admin1, admin2, ...savedUsers];

    // Create Products
    console.log('Creating products...');
    const products = [
      {
        name: 'Laptop Pro 15',
        description: 'High-performance laptop with 16GB RAM, 512GB SSD, Intel i7 processor. Perfect for professionals and developers.',
        purchasePrice: 800.00,
        salePrice: 1299.99,
        stock: 25,
        isVisible: true,
        images: ['/uploads/laptop-pro-15.jpg'],
      },
      {
        name: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse with 2.4GHz connectivity. Long battery life up to 12 months.',
        purchasePrice: 8.50,
        salePrice: 19.99,
        stock: 150,
        isVisible: true,
        images: ['/uploads/wireless-mouse.jpg'],
      },
      {
        name: 'Mechanical Keyboard',
        description: 'RGB backlit mechanical keyboard with Cherry MX switches. Perfect for gaming and typing.',
        purchasePrice: 45.00,
        salePrice: 89.99,
        stock: 75,
        isVisible: true,
        images: ['/uploads/mechanical-keyboard.jpg'],
      },
      {
        name: 'USB-C Hub',
        description: '7-in-1 USB-C hub with HDMI, USB 3.0 ports, SD card reader, and power delivery.',
        purchasePrice: 25.00,
        salePrice: 49.99,
        stock: 100,
        isVisible: true,
        images: ['/uploads/usb-c-hub.jpg'],
      },
      {
        name: 'Monitor 27" 4K',
        description: 'Ultra HD 4K monitor with IPS panel, 60Hz refresh rate, and HDR support.',
        purchasePrice: 300.00,
        salePrice: 599.99,
        stock: 40,
        isVisible: true,
        images: ['/uploads/monitor-27-4k.jpg'],
      },
      {
        name: 'Webcam HD 1080p',
        description: 'Full HD webcam with auto-focus, built-in microphone, and privacy shutter.',
        purchasePrice: 35.00,
        salePrice: 69.99,
        stock: 80,
        isVisible: true,
        images: ['/uploads/webcam-hd.jpg'],
      },
      {
        name: 'Desk Lamp LED',
        description: 'Adjustable LED desk lamp with touch control, 5 brightness levels, and USB charging port.',
        purchasePrice: 15.00,
        salePrice: 34.99,
        stock: 120,
        isVisible: true,
        images: ['/uploads/desk-lamp-led.jpg'],
      },
      {
        name: 'Laptop Stand',
        description: 'Aluminum laptop stand with adjustable height and ventilation design.',
        purchasePrice: 20.00,
        salePrice: 39.99,
        stock: 90,
        isVisible: true,
        images: ['/uploads/laptop-stand.jpg'],
      },
      {
        name: 'Noise Cancelling Headphones',
        description: 'Premium wireless headphones with active noise cancellation and 30-hour battery life.',
        purchasePrice: 120.00,
        salePrice: 249.99,
        stock: 50,
        isVisible: true,
        images: ['/uploads/headphones.jpg'],
      },
      {
        name: 'External SSD 1TB',
        description: 'Portable external SSD with USB-C interface, read speeds up to 1050MB/s.',
        purchasePrice: 60.00,
        salePrice: 119.99,
        stock: 65,
        isVisible: false, // Hidden product for testing
        images: ['/uploads/external-ssd.jpg'],
      },
    ];

    const savedProducts = await productRepository.save(
      products.map((p) => ({
        ...p,
        margin: p.salePrice - p.purchasePrice,
      }))
    );

    // Create Orders
    console.log('Creating orders...');
    const orders = [
      {
        userId: savedUsers[0].id, // John Doe
        status: OrderStatus.PROCEEDED,
        totalAmount: 1299.99 + 19.99 + 89.99, // Laptop + Mouse + Keyboard
        orderItems: [
          { productId: savedProducts[0].id, quantity: 1, price: 1299.99 },
          { productId: savedProducts[1].id, quantity: 1, price: 19.99 },
          { productId: savedProducts[2].id, quantity: 1, price: 89.99 },
        ],
      },
      {
        userId: savedUsers[1].id, // Jane Smith
        status: OrderStatus.PLACED,
        totalAmount: 599.99 + 49.99, // Monitor + USB-C Hub
        orderItems: [
          { productId: savedProducts[4].id, quantity: 1, price: 599.99 },
          { productId: savedProducts[3].id, quantity: 1, price: 49.99 },
        ],
      },
      {
        userId: savedUsers[0].id, // John Doe
        status: OrderStatus.PROCEEDED,
        totalAmount: 69.99 + 34.99, // Webcam + Desk Lamp
        orderItems: [
          { productId: savedProducts[5].id, quantity: 2, price: 69.99 },
          { productId: savedProducts[6].id, quantity: 1, price: 34.99 },
        ],
      },
      {
        userId: savedUsers[2].id, // Bob Johnson
        status: OrderStatus.CANCELLED,
        totalAmount: 249.99, // Headphones
        orderItems: [
          { productId: savedProducts[8].id, quantity: 1, price: 249.99 },
        ],
      },
      {
        userId: savedUsers[1].id, // Jane Smith
        status: OrderStatus.PLACED,
        totalAmount: 39.99, // Laptop Stand
        orderItems: [
          { productId: savedProducts[7].id, quantity: 1, price: 39.99 },
        ],
      },
    ];

    for (const orderData of orders) {
      const order = orderRepository.create({
        userId: orderData.userId,
        status: orderData.status,
        totalAmount: orderData.totalAmount,
      });
      const savedOrder = await orderRepository.save(order);

      const orderItems = orderData.orderItems.map((item) =>
        orderItemRepository.create({
          orderId: savedOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })
      );
      await orderItemRepository.save(orderItems);
    }

    // Create Notifications
    console.log('Creating notifications...');
    const notifications = [
      {
        title: 'New Order Placed',
        message: 'Order #12345678 has been placed with total amount of $1,409.97',
        isRead: false,
      },
      {
        title: 'Order Proceeded',
        message: 'Order #12345678 has been proceeded successfully',
        isRead: true,
      },
      {
        title: 'Order Cancelled',
        message: 'Order #87654321 has been cancelled by the customer',
        isRead: false,
      },
      {
        title: 'New Order Placed',
        message: 'Order #11223344 has been placed with total amount of $649.98',
        isRead: false,
      },
      {
        title: 'Low Stock Alert',
        message: 'Product "Laptop Pro 15" is running low on stock (25 units remaining)',
        isRead: false,
      },
    ];

    await notificationRepository.save(notifications);

    console.log('\n✅ Seed data created successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - ${allUsers.length} users (2 admins, ${savedUsers.length} regular users)`);
    console.log(`   - ${savedProducts.length} products`);
    console.log(`   - ${orders.length} orders`);
    console.log(`   - ${notifications.length} notifications`);
    console.log('\n🔑 Test Credentials:');
    console.log('   Admin:');
    console.log('     Email: admin@example.com');
    console.log('     Password: admin123');
    console.log('   Users:');
    console.log('     Email: john@example.com');
    console.log('     Password: user123');
    console.log('     Email: jane@example.com');
    console.log('     Password: user123');
    console.log('     Email: bob@example.com');
    console.log('     Password: user123');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await AppDataSource.destroy();
  }
}

// Run if called directly
if (require.main === module) {
  seed()
    .then(() => {
      console.log('\n✨ Seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

export { seed };
