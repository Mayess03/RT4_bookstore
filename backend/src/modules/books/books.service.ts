import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../../database/entities/book.entity';
import { Category } from '../../database/entities/category.entity';
import { CreateBookDto, UpdateBookDto, QueryBookDto } from './dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  /**
   * BOOK-01: Afficher la liste des livres avec pagination
   * BOOK-03: Rechercher des livres (titre, auteur, ISBN)
   * BOOK-04: Filtrer par catégorie
   * BOOK-05: Filtrer par prix (min-max)
   * BOOK-06: Trier (prix, date, popularité, note)
   */
  async findAll(queryDto: QueryBookDto) {
    const {
      page = 1,
      limit = 10,
      search,
      author,
      isbn,
      categoryId,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      order = 'DESC',
    } = queryDto;

    const query = this.bookRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.category', 'category')
      .leftJoin('book.reviews', 'review')
      .leftJoin('book.orderItems', 'orderItem')
      .addSelect('AVG(review.rating)', 'avgRating')
      .addSelect('COUNT(DISTINCT orderItem.id)', 'totalSales')
      .groupBy('book.id')
      .addGroupBy('category.id');

    // BOOK-03: Recherche par titre
    if (search) {
      query.andWhere('book.title ILIKE :search', { search: `%${search}%` });
    }

    // BOOK-03: Recherche par auteur
    if (author) {
      query.andWhere('book.author ILIKE :author', { author: `%${author}%` });
    }

    // BOOK-03: Recherche par ISBN
    if (isbn) {
      query.andWhere('book.isbn = :isbn', { isbn });
    }

    // BOOK-04: Filtrer par catégorie
    if (categoryId) {
      query.andWhere('book.categoryId = :categoryId', { categoryId });
    }

    // BOOK-05: Filtrer par prix min
    if (minPrice !== undefined) {
      query.andWhere('book.price >= :minPrice', { minPrice });
    }

    // BOOK-05: Filtrer par prix max
    if (maxPrice !== undefined) {
      query.andWhere('book.price <= :maxPrice', { maxPrice });
    }

    // BOOK-06: Tri
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

    // Pagination
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

  /**
   * BOOK-02: Voir les détails d'un livre
   * BOOK-09: Consulter les avis sur un livre
   */
  async findOne(id: string) {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: ['category', 'reviews', 'reviews.user'],
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    // Calculer la note moyenne
    const avgRating =
      book.reviews.length > 0
        ? book.reviews.reduce((acc, review) => acc + review.rating, 0) /
          book.reviews.length
        : 0;

    return {
      ...book,
      avgRating: parseFloat(avgRating.toFixed(2)),
      reviewsCount: book.reviews.length,
    };
  }

  /**
   * BOOK-07: Voir les livres les plus vendus
   */
  async getBestSellers(limit: number = 10) {
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
      .then((result) =>
        result.entities.map((book, index) => ({
          ...book,
          totalSales: parseInt(result.raw[index].totalSales) || 0,
          avgRating: parseFloat(result.raw[index].avgRating) || 0,
        })),
      );
  }

  /**
   * BOOK-08: Voir les nouveautés
   */
  async getNewArrivals(limit: number = 10) {
    return this.bookRepository.find({
      relations: ['category'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  /**
   * Get all book categories
   */
  async getCategories() {
    return this.categoryRepository.find({
      order: { name: 'ASC' },
    });
  }

  /**
   * BOOK-10: Ajouter un nouveau livre (ADMIN)
   */
  async create(createBookDto: CreateBookDto) {
    // Vérifier si ISBN existe déjà (excluding soft-deleted books)
    const existingBook = await this.bookRepository.findOne({
      where: { isbn: createBookDto.isbn },
      withDeleted: false, // Only check active books
    });

    if (existingBook) {
      throw new ConflictException(
        `Book with ISBN ${createBookDto.isbn} already exists`,
      );
    }

    const book = this.bookRepository.create(createBookDto);
    return this.bookRepository.save(book);
  }

  /**
   * BOOK-11: Modifier un livre existant (ADMIN)
   */
  async update(id: string, updateBookDto: UpdateBookDto) {
    const book = await this.findOne(id);

    // Vérifier si le nouvel ISBN existe déjà (si changé)
    if (updateBookDto.isbn && updateBookDto.isbn !== book.isbn) {
      const existingBook = await this.bookRepository.findOne({
        where: { isbn: updateBookDto.isbn },
      });

      if (existingBook) {
        throw new ConflictException(
          `Book with ISBN ${updateBookDto.isbn} already exists`,
        );
      }
    }

    Object.assign(book, updateBookDto);
    return this.bookRepository.save(book);
  }

  /**
   * BOOK-12: Supprimer un livre (ADMIN - soft delete)
   */
  async remove(id: string) {
    const book = await this.findOne(id);
    await this.bookRepository.softRemove(book);
    return { message: `Book "${book.title}" deleted successfully` };
  }

  /**
   * BOOK-14: Gérer le stock (quantités) (ADMIN)
   */
  async updateStock(id: string, quantity: number) {
    const book = await this.findOne(id);

    if (quantity < 0 && Math.abs(quantity) > book.stock) {
      throw new BadRequestException('Insufficient stock');
    }

    book.stock += quantity;
    return this.bookRepository.save(book);
  }

  /**
   * BOOK-15: Activer/Désactiver un livre (ADMIN)
   */
  async toggleActive(id: string, isActive: boolean) {
    const book = await this.findOne(id);
    book.isActive = isActive;
    return this.bookRepository.save(book);
  }

  /**
   * CART-08: Vérifier la disponibilité du stock
   */
  async checkStock(id: string, quantity: number): Promise<boolean> {
    const book = await this.findOne(id);
    return book.stock >= quantity && book.isActive;
  }

  /**
   * Réduire le stock après une commande
   */
  async decreaseStock(id: string, quantity: number) {
    const book = await this.findOne(id);

    if (book.stock < quantity) {
      throw new BadRequestException(
        `Insufficient stock for book "${book.title}". Available: ${book.stock}`,
      );
    }

    book.stock -= quantity;
    return this.bookRepository.save(book);
  }
}
