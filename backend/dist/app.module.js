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
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const bcrypt = __importStar(require("bcrypt"));
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const entities_1 = require("./database/entities");
const books_module_1 = require("./modules/books/books.module");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const admin_module_1 = require("./modules/admin/admin.module");
const cart_module_1 = require("./modules/cart/cart.module");
const category_module_1 = require("./modules/category/category.module");
const orders_module_1 = require("./modules/orders/orders.module");
const stats_module_1 = require("./modules/stats/stats.module");
const users_service_1 = require("./modules/users/users.service");
const enums_1 = require("./common/enums");
let AppModule = class AppModule {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    async onModuleInit() {
        const adminEmail = 'admin@bookstore.com';
        const existingAdmin = await this.usersService.findByEmail(adminEmail);
        if (existingAdmin)
            return;
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await this.usersService.create({
            email: adminEmail,
            password: hashedPassword,
            firstName: 'Admin',
            lastName: 'System',
            role: enums_1.Role.ADMIN,
        });
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST'),
                    port: configService.get('DB_PORT'),
                    username: configService.get('DB_USERNAME'),
                    password: configService.get('DB_PASSWORD'),
                    database: configService.get('DB_NAME'),
                    entities: [
                        entities_1.User,
                        entities_1.Book,
                        entities_1.Category,
                        entities_1.Order,
                        entities_1.OrderItem,
                        entities_1.Cart,
                        entities_1.CartItem,
                        entities_1.Review,
                        entities_1.Wishlist,
                        entities_1.Address,
                    ],
                    synchronize: configService.get('NODE_ENV') !== 'production',
                    logging: configService.get('NODE_ENV') === 'development',
                }),
            }),
            books_module_1.BooksModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            admin_module_1.AdminModule,
            cart_module_1.CartModule,
            category_module_1.CategoryModule,
            orders_module_1.OrdersModule,
            stats_module_1.StatsModule,
            category_module_1.CategoryModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    }),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], AppModule);
//# sourceMappingURL=app.module.js.map