"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt = __importStar(require("bcrypt"));
const jwt_1 = require("@nestjs/jwt");
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const cart_service_1 = require("../cart/cart.service");
let AuthService = class AuthService {
    usersService;
    jwt;
    cartService;
    constructor(usersService, jwt, cartService) {
        this.usersService = usersService;
        this.jwt = jwt;
        this.cartService = cartService;
    }
    async register(dto) {
        const exists = await this.usersService.findByEmail(dto.email);
        if (exists) {
            throw new common_1.ConflictException('Email already used');
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
        this.cartService.create({ userId: user.id });
        const verifyUrl = `${process.env.FRONT_URL || 'http://localhost:4200'}` +
            `/verify-email?token=${token}`;
        return {
            message: 'Account created. Verify your email.',
        };
    }
    async login(dto) {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const passwordOk = await bcrypt.compare(dto.password, user.password);
        if (!passwordOk) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = {
            sub: user.id,
            role: user.role,
        };
        return {
            accessToken: await this.jwt.signAsync(payload),
            refreshToken: await this.jwt.signAsync(payload),
        };
    }
    async refresh(userId) {
        return {
            accessToken: await this.jwt.signAsync({ sub: userId }),
        };
    }
    logout() {
        return { message: 'Logged out' };
    }
    async forgotPassword(email) {
        const user = await this.usersService.findByEmail(email);
        if (!user)
            return;
        const token = this.jwt.sign({
            sub: user.id,
        });
        const resetUrl = `${process.env.FRONT_URL || 'http://localhost:4200'}` +
            `/reset-password?token=${token}`;
        return { message: 'Reset email sent' };
    }
    async resetPassword(token, newPassword) {
        const payload = this.jwt.verify(token);
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.usersService.resetPasswordById(payload.sub, hashedPassword);
        return { message: 'Password updated' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        cart_service_1.CartService])
], AuthService);
//# sourceMappingURL=auth.service.js.map