import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../database/entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  // CAT-01: créer une catégorie
  async create(dto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create(dto);
    return this.categoryRepository.save(category);
  }

  // CAT-02: modifier une catégorie
  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.categoryRepository.findOneBy({ id });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    Object.assign(category, dto);
    return this.categoryRepository.save(category);
  }

  // CAT-03: supprimer une catégorie
  async remove(id: string): Promise<void> {
    const result = await this.categoryRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException('Category not found');
    }
  }

  // CAT-04 / CAT-05: lister toutes les catégories
  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  // CAT-06: parcourir les livres par catégorie
  async findBooksByCategory(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: {
        books: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }
}
