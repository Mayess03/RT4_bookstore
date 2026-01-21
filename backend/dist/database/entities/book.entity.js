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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
const typeorm_1 = require("typeorm");
const baseEntity_1 = require("../../common/entities/baseEntity");
const category_entity_1 = require("./category.entity");
const order_item_entity_1 = require("./order-item.entity");
const cart_item_entity_1 = require("./cart-item.entity");
const review_entity_1 = require("./review.entity");
const wishlist_entity_1 = require("./wishlist.entity");
let Book = class Book extends baseEntity_1.BaseEntity {
    title;
    author;
    isbn;
    price;
    stock;
    coverImage;
    description;
    isActive;
    categoryId;
    category;
    orderItems;
    cartItems;
    reviews;
    wishlists;
};
exports.Book = Book;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Book.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Book.prototype, "author", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Book.prototype, "isbn", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Book.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Book.prototype, "stock", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cover_image', nullable: true }),
    __metadata("design:type", String)
], Book.prototype, "coverImage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Book.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], Book.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'category_id', nullable: true }),
    __metadata("design:type", String)
], Book.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => category_entity_1.Category, (category) => category.books, {
        onDelete: 'SET NULL',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'category_id' }),
    __metadata("design:type", category_entity_1.Category)
], Book.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_item_entity_1.OrderItem, (orderItem) => orderItem.book),
    __metadata("design:type", Array)
], Book.prototype, "orderItems", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cart_item_entity_1.CartItem, (cartItem) => cartItem.book),
    __metadata("design:type", Array)
], Book.prototype, "cartItems", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => review_entity_1.Review, (review) => review.book, { cascade: true }),
    __metadata("design:type", Array)
], Book.prototype, "reviews", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => wishlist_entity_1.Wishlist, (wishlist) => wishlist.book, { cascade: true }),
    __metadata("design:type", Array)
], Book.prototype, "wishlists", void 0);
exports.Book = Book = __decorate([
    (0, typeorm_1.Entity)('books')
], Book);
//# sourceMappingURL=book.entity.js.map