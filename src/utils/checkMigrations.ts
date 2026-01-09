import 'reflect-metadata';
import { AppDataSource } from '../config/datasource';

async function checkMigrations() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected successfully\n');

    const queryRunner = AppDataSource.createQueryRunner();
    
    // Check if migrations table exists
    const migrationsTableExists = await queryRunner.hasTable('migrations');
    
    if (!migrationsTableExists) {
      console.log('⚠️  Migrations table does not exist.');
      console.log('   This means no migrations have been run yet.');
      console.log('   Run: npm run migration:run\n');
    } else {
      // Get executed migrations
      const executedMigrations = await queryRunner.query(
        'SELECT * FROM migrations ORDER BY timestamp DESC'
      );
      
      if (executedMigrations.length === 0) {
        console.log('⚠️  No migrations have been executed yet.');
        console.log('   Run: npm run migration:run\n');
      } else {
        console.log('✅ Executed migrations:');
        executedMigrations.forEach((migration: any) => {
          console.log(`   - ${migration.name} (${new Date(parseInt(migration.timestamp)).toISOString()})`);
        });
        console.log('');
      }
    }

    // Check if tables exist
    const tables = ['users', 'products', 'orders', 'order_items', 'notifications'];
    console.log('📊 Table status:');
    for (const table of tables) {
      const exists = await queryRunner.hasTable(table);
      console.log(`   ${exists ? '✅' : '❌'} ${table}`);
    }
    console.log('');

    await queryRunner.release();
  } catch (error) {
    console.error('Error checking migrations:', error);
    throw error;
  } finally {
    await AppDataSource.destroy();
  }
}

if (require.main === module) {
  checkMigrations()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('❌ Check failed:', error);
      process.exit(1);
    });
}

export { checkMigrations };
