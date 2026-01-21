import { Repository } from 'typeorm';
import { Category } from '../../database/entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoryService {
    private readonly categoryRepository;
    constructor(categoryRepository: Repository<Category>);
    create(dto: CreateCategoryDto): Promise<Category>;
    update(id: string, dto: UpdateCategoryDto): Promise<Category>;
    remove(id: string): Promise<void>;
    findAll(): Promise<Category[]>;
    findBooksByCategory(id: string): Promise<Category>;
}
