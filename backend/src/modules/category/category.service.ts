import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../database/entities/category.entity';
import { Book } from '../../database/entities/book.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  /**
   * CAT-01: Afficher la liste des catégories
   */
  async findAll(withBookCount: boolean = false) {
    if (withBookCount) {
      const categories = await this.categoryRepository
        .createQueryBuilder('category')
        .leftJoin('category.books', 'book')
        .addSelect('COUNT(book.id)', 'booksCount')
        .groupBy('category.id')
        .orderBy('category.name', 'ASC')
        .getRawAndEntities();

      return categories.entities.map((category, index) => ({
        ...category,
        booksCount: parseInt(categories.raw[index].booksCount) || 0,
      }));
    }

    return this.categoryRepository.find({
      order: { name: 'ASC' },
    });
  }

  /**
   * CAT-02: Voir les détails d'une catégorie
   */
  async findOne(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // Compter le nombre de livres dans cette catégorie
    const booksCount = await this.bookRepository.count({
      where: { categoryId: id },
    });

    return {
      ...category,
      booksCount,
    };
  }

  /**
   * CAT-03: Voir les livres d'une catégorie avec pagination
   */
  async findBooksByCategory(
    id: string,
    options: { limit?: number; page?: number } = {},
  ) {
    const { limit = 10, page = 1 } = options;

    // Vérifier que la catégorie existe
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // Récupérer les livres avec pagination
    const query = this.bookRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.category', 'category')
      .leftJoin('book.reviews', 'review')
      .addSelect('AVG(review.rating)', 'avgRating')
      .addSelect('COUNT(review.id)', 'reviewsCount')
      .where('category.id = :categoryId', { categoryId: id })
      .andWhere('book.isActive = :isActive', { isActive: true })
      .groupBy('book.id')
      .addGroupBy('category.id')
      .orderBy('book.createdAt', 'DESC');

    const total = await query.getCount();
    const books = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getRawAndEntities();

    return {
      category: {
        id: category.id,
        name: category.name,
        description: category.description,
      },
      data: books.entities.map((book, index) => ({
        ...book,
        avgRating: parseFloat(books.raw[index].avgRating) || 0,
        reviewsCount: parseInt(books.raw[index].reviewsCount) || 0,
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
   * CAT-04: Ajouter une nouvelle catégorie (ADMIN)
   */
  async create(createCategoryDto: CreateCategoryDto) {
    // Vérifier si une catégorie avec ce nom existe déjà
    const existingCategory = await this.categoryRepository.findOne({
      where: { name: createCategoryDto.name },
      withDeleted: false,
    });

    if (existingCategory) {
      throw new ConflictException(
        `Category with name "${createCategoryDto.name}" already exists`,
      );
    }

    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  /**
   * CAT-05: Modifier une catégorie (ADMIN)
   */
  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);

    // Vérifier si le nouveau nom existe déjà (si changé)
    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { name: updateCategoryDto.name },
      });

      if (existingCategory) {
        throw new ConflictException(
          `Category with name "${updateCategoryDto.name}" already exists`,
        );
      }
    }

    Object.assign(category, updateCategoryDto);
    return this.categoryRepository.save(category);
  }

  /**
   * CAT-06: Supprimer une catégorie (ADMIN - soft delete)
   */
  async remove(id: string) {
    const category = await this.findOne(id);

    // Vérifier si la catégorie contient des livres
    const booksCount = await this.bookRepository.count({
      where: { categoryId: id },
    });

    if (booksCount > 0) {
      throw new BadRequestException(
        `Cannot delete category "${category.name}" because it contains ${booksCount} book(s). Please reassign or delete the books first.`,
      );
    }

    await this.categoryRepository.softRemove(category);
    return {
      message: `Category "${category.name}" deleted successfully`,
      deletedCategory: {
        id: category.id,
        name: category.name,
      },
    };
  }

  /**
   * CAT-07: Obtenir les statistiques d'une catégorie (ADMIN)
   */
  async getCategoryStats(id: string) {
    const category = await this.findOne(id);

    const stats = await this.bookRepository
      .createQueryBuilder('book')
      .leftJoin('book.category', 'category')
      .leftJoin('book.reviews', 'review')
      .leftJoin('book.orderItems', 'orderItem')
      .select('COUNT(DISTINCT book.id)', 'totalBooks')
      .addSelect('SUM(book.stock)', 'totalStock')
      .addSelect('AVG(book.price)', 'avgPrice')
      .addSelect('AVG(review.rating)', 'avgRating')
      .addSelect('COUNT(DISTINCT review.id)', 'totalReviews')
      .addSelect('COUNT(DISTINCT orderItem.id)', 'totalSales')
      .where('category.id = :categoryId', { categoryId: id })
      .getRawOne();

    return {
      category: {
        id: category.id,
        name: category.name,
        description: category.description,
      },
      stats: {
        totalBooks: parseInt(stats.totalBooks) || 0,
        totalStock: parseInt(stats.totalStock) || 0,
        avgPrice: parseFloat(stats.avgPrice) || 0,
        avgRating: parseFloat(stats.avgRating) || 0,
        totalReviews: parseInt(stats.totalReviews) || 0,
        totalSales: parseInt(stats.totalSales) || 0,
      },
    };
  }

  /**
   * Obtenir toutes les catégories pour les filtres
   */
  async getCategories() {
    return this.categoryRepository.find({
      order: { name: 'ASC' },
    });
  }
}
