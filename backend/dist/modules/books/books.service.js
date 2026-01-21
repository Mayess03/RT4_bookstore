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
exports.BooksService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const book_entity_1 = require("../../database/entities/book.entity");
const category_entity_1 = require("../../database/entities/category.entity");
let BooksService = class BooksService {
    bookRepository;
    categoryRepository;
    constructor(bookRepository, categoryRepository) {
        this.bookRepository = bookRepository;
        this.categoryRepository = categoryRepository;
    }
    async findAll(queryDto) {
        const { page = 1, limit = 10, search, author, isbn, categoryId, minPrice, maxPrice, sortBy = 'createdAt', order = 'DESC', } = queryDto;
        const query = this.bookRepository
            .createQueryBuilder('book')
            .leftJoinAndSelect('book.category', 'category')
            .leftJoin('book.reviews', 'review')
            .leftJoin('book.orderItems', 'orderItem')
            .addSelect('AVG(review.rating)', 'avgRating')
            .addSelect('COUNT(DISTINCT orderItem.id)', 'totalSales')
            .groupBy('book.id')
            .addGroupBy('category.id');
        if (search) {
            query.andWhere('book.title ILIKE :search', { search: `%${search}%` });
        }
        if (author) {
            query.andWhere('book.author ILIKE :author', { author: `%${author}%` });
        }
        if (isbn) {
            query.andWhere('book.isbn = :isbn', { isbn });
        }
        if (categoryId) {
            query.andWhere('book.categoryId = :categoryId', { categoryId });
        }
        if (minPrice !== undefined) {
            query.andWhere('book.price >= :minPrice', { minPrice });
        }
        if (maxPrice !== undefined) {
            query.andWhere('book.price <= :maxPrice', { maxPrice });
        }
        switch (sortBy) {
            case 'price':
                query.orderBy('book.price', order);
                break;
            case 'title':
                query.orderBy('book.title', order);
                break;
            case 'rating':
                query.orderBy('avgRating', order === 'ASC' ? 'ASC' : 'DESC');
                break;
            case 'bestseller':
                query.orderBy('totalSales', 'DESC');
                break;
            default:
                query.orderBy('book.createdAt', order);
        }
        const total = await query.getCount();
        const books = await query
            .skip((page - 1) * limit)
            .take(limit)
            .getRawAndEntities();
        return {
            data: books.entities.map((book, index) => ({
                ...book,
                avgRating: parseFloat(books.raw[index].avgRating) || 0,
                totalSales: parseInt(books.raw[index].totalSales) || 0,
            })),
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const book = await this.bookRepository.findOne({
            where: { id },
            relations: ['category', 'reviews', 'reviews.user'],
        });
        if (!book) {
            throw new common_1.NotFoundException(`Book with ID ${id} not found`);
        }
        const avgRating = book.reviews.length > 0
            ? book.reviews.reduce((acc, review) => acc + review.rating, 0) /
                book.reviews.length
            : 0;
        return {
            ...book,
            avgRating: parseFloat(avgRating.toFixed(2)),
            reviewsCount: book.reviews.length,
        };
    }
    async getBestSellers(limit = 10) {
        return this.bookRepository
            .createQueryBuilder('book')
            .leftJoinAndSelect('book.category', 'category')
            .leftJoin('book.orderItems', 'orderItem')
            .leftJoin('book.reviews', 'review')
            .select([
            'book',
            'category',
            'COUNT(DISTINCT orderItem.id) as totalSales',
            'AVG(review.rating) as avgRating',
        ])
            .groupBy('book.id')
            .addGroupBy('category.id')
            .orderBy('totalSales', 'DESC')
            .limit(limit)
            .getRawAndEntities()
            .then((result) => result.entities.map((book, index) => ({
            ...book,
            totalSales: parseInt(result.raw[index].totalSales) || 0,
            avgRating: parseFloat(result.raw[index].avgRating) || 0,
        })));
    }
    async getNewArrivals(limit = 10) {
        return this.bookRepository.find({
            relations: ['category'],
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }
    async getCategories() {
        return this.categoryRepository.find({
            order: { name: 'ASC' },
        });
    }
    async create(createBookDto) {
        const existingBook = await this.bookRepository.findOne({
            where: { isbn: createBookDto.isbn },
            withDeleted: false,
        });
        if (existingBook) {
            throw new common_1.ConflictException(`Book with ISBN ${createBookDto.isbn} already exists`);
        }
        const book = this.bookRepository.create(createBookDto);
        return this.bookRepository.save(book);
    }
    async update(id, updateBookDto) {
        const book = await this.findOne(id);
        if (updateBookDto.isbn && updateBookDto.isbn !== book.isbn) {
            const existingBook = await this.bookRepository.findOne({
                where: { isbn: updateBookDto.isbn },
            });
            if (existingBook) {
                throw new common_1.ConflictException(`Book with ISBN ${updateBookDto.isbn} already exists`);
            }
        }
        Object.assign(book, updateBookDto);
        return this.bookRepository.save(book);
    }
    async remove(id) {
        const book = await this.findOne(id);
        await this.bookRepository.softRemove(book);
        return { message: `Book "${book.title}" deleted successfully` };
    }
    async updateStock(id, quantity) {
        const book = await this.findOne(id);
        if (quantity < 0 && Math.abs(quantity) > book.stock) {
            throw new common_1.BadRequestException('Insufficient stock');
        }
        book.stock += quantity;
        return this.bookRepository.save(book);
    }
    async toggleActive(id, isActive) {
        const book = await this.findOne(id);
        book.isActive = isActive;
        return this.bookRepository.save(book);
    }
    async checkStock(id, quantity) {
        const book = await this.findOne(id);
        return book.stock >= quantity && book.isActive;
    }
    async decreaseStock(id, quantity) {
        const book = await this.findOne(id);
        if (book.stock < quantity) {
            throw new common_1.BadRequestException(`Insufficient stock for book "${book.title}". Available: ${book.stock}`);
        }
        book.stock -= quantity;
        return this.bookRepository.save(book);
    }
};
exports.BooksService = BooksService;
exports.BooksService = BooksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(book_entity_1.Book)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], BooksService);
//# sourceMappingURL=books.service.js.map