import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwt: JwtService,
  ) {}

  // REGISTER
  async register(dto: RegisterDto) {
    const exists = await this.usersService.findByEmail(dto.email);
    if (exists) {
      throw new ConflictException('Email already used');
    }

    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(dto.password, salt);

    const user = await this.usersService.create({
      email: dto.email,
      password,
      firstName: dto.firstName,
      lastName: dto.lastName,
    });

    const token = this.jwt.sign({
      sub: user.id,
    });

    const verifyUrl =
      `${process.env.FRONT_URL || 'http://localhost:4200'}` +
      `/verify-email?token=${token}`;

    return {
      message: 'Account created. Verify your email.',
    };
  }

  // LOGIN
  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordOk = await bcrypt.compare(dto.password, user.password);
    if (!passwordOk) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: user.id,
      role: user.role,
    };

    return {
      accessToken: await this.jwt.signAsync(payload),
      refreshToken: await this.jwt.signAsync(payload),
    };
  }

  // REFRESH
  async refresh(userId: string) {
    return {
      accessToken: await this.jwt.signAsync({ sub: userId }),
    };
  }

  // LOGOUT
  logout() {
    return { message: 'Logged out' };
  }

  // FORGOT PASSWORD
  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return;

    const token = this.jwt.sign({
      sub: user.id,
    });

    const resetUrl =
      `${process.env.FRONT_URL || 'http://localhost:4200'}` +
      `/reset-password?token=${token}`;

    return { message: 'Reset email sent' };
  }

  // RESET PASSWORD
  async resetPassword(token: string, newPassword: string) {
    const payload = this.jwt.verify(token) as JwtPayload;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.usersService.resetPasswordById(
      payload.sub,
      hashedPassword,
    );

    return { message: 'Password updated' };
  }
}
