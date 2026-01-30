import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  User,
  Book,
  Category,
  Order,
  OrderItem,
  Cart,
  CartItem,
  Review,
  Wishlist,
  Address,
} from './database/entities';
import { BooksModule } from './modules/books/books.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AdminModule } from './modules/admin/admin.module';
import { CartModule } from './modules/cart/cart.module';
import { CategoryModule } from './modules/category/category.module';
import {OrdersModule } from './modules/orders/orders.module';
import { StatsModule } from './modules/stats/stats.module';
import { UsersService } from './modules/users/users.service';
import { Role } from './common/enums';
import { WishlistModule } from './modules/wishlist/wishlist.module';
import { ReviewsModule } from './modules/reviews/reviews.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [
          User,
          Book,
          Category,
          Order,
          OrderItem,
          Cart,
          CartItem,
          Review,
          Wishlist,
          Address,
        ],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') === 'development',
      }),
    }),
    BooksModule,
    AuthModule,
    UsersModule,
    AdminModule,
    CartModule,
    CategoryModule,
    OrdersModule,
    StatsModule,
    CategoryModule,
    WishlistModule,
    ReviewsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly usersService: UsersService) {}

  async onModuleInit() {
    const adminEmail = 'admin@bookstore.com';

    const existingAdmin = await this.usersService.findByEmail(adminEmail);
    if (existingAdmin) return;

    const hashedPassword = await bcrypt.hash('admin123', 10);

    await this.usersService.create({
      email: adminEmail,
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'System',
      role: Role.ADMIN,
    });
  }
}
