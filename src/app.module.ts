import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { Role } from './common/enum/role.enum';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true, 
    }),

    UsersModule,
    AuthModule,
    AdminModule,
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

    const password = await bcrypt.hash('admin123', 10);

    await this.usersService.create({
      email: adminEmail,
      password,
      firstName: 'Admin',
      lastName: 'System',
      role: Role.ADMIN,
    });

    console.log(' Default admin created');
  }
}
