"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooksController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const books_service_1 = require("./books.service");
const dto_1 = require("./dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const role_enum_1 = require("../../common/enums/role.enum");
let BooksController = class BooksController {
    booksService;
    constructor(booksService) {
        this.booksService = booksService;
    }
    findAll(queryDto) {
        return this.booksService.findAll(queryDto);
    }
    getBestSellers(limit) {
        return this.booksService.getBestSellers(limit || 10);
    }
    getNewArrivals(limit) {
        return this.booksService.getNewArrivals(limit || 10);
    }
    getCategories() {
        return this.booksService.getCategories();
    }
    findOne(id) {
        return this.booksService.findOne(id);
    }
    create(createBookDto) {
        return this.booksService.create(createBookDto);
    }
    update(id, updateBookDto) {
        return this.booksService.update(id, updateBookDto);
    }
    remove(id) {
        return this.booksService.remove(id);
    }
    updateStock(id, quantity) {
        return this.booksService.updateStock(id, quantity);
    }
    toggleActive(id, isActive) {
        return this.booksService.toggleActive(id, isActive);
    }
    checkStock(id, quantity) {
        return this.booksService.checkStock(id, quantity);
    }
};
exports.BooksController = BooksController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Liste tous les livres avec filtres et pagination' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des livres récupérée' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'author', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'isbn', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'categoryId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'minPrice', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'maxPrice', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({
        name: 'sortBy',
        required: false,
        enum: ['price', 'createdAt', 'title', 'rating', 'bestseller'],
    }),
    (0, swagger_1.ApiQuery)({ name: 'order', required: false, enum: ['ASC', 'DESC'] }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.QueryBookDto]),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('bestsellers'),
    (0, swagger_1.ApiOperation)({ summary: 'Top 10 des livres les plus vendus' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des bestsellers' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 10 }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "getBestSellers", null);
__decorate([
    (0, common_1.Get)('new-arrivals'),
    (0, swagger_1.ApiOperation)({ summary: 'Derniers livres ajoutés (nouveautés)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des nouveautés' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 10 }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "getNewArrivals", null);
__decorate([
    (0, common_1.Get)('categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Liste de toutes les catégories de livres' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des catégories récupérée' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Détails d\'un livre avec ses avis' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Détails du livre récupérés' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Livre non trouvé' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: '[ADMIN] Créer un nouveau livre' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Livre créé avec succès' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'ISBN déjà existant' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateBookDto]),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: '[ADMIN] Modifier un livre' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Livre modifié avec succès' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Livre non trouvé' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateBookDto]),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: '[ADMIN] Supprimer un livre (soft delete)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Livre supprimé avec succès' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Livre non trouvé' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/stock'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: '[ADMIN] Mettre à jour le stock d\'un livre' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Stock mis à jour' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Stock insuffisant' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('quantity')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "updateStock", null);
__decorate([
    (0, common_1.Patch)(':id/toggle-active'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: '[ADMIN] Activer/Désactiver un livre' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statut du livre modifié' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "toggleActive", null);
__decorate([
    (0, common_1.Get)(':id/check-stock'),
    (0, swagger_1.ApiOperation)({ summary: 'Vérifier la disponibilité du stock' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Disponibilité vérifiée' }),
    (0, swagger_1.ApiQuery)({ name: 'quantity', required: true, type: Number }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('quantity')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "checkStock", null);
exports.BooksController = BooksController = __decorate([
    (0, swagger_1.ApiTags)('Books'),
    (0, common_1.Controller)('books'),
    __metadata("design:paramtypes", [books_service_1.BooksService])
], BooksController);
//# sourceMappingURL=books.controller.js.map