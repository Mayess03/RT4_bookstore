import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    create(dto: CreateCategoryDto): Promise<import("../../database/entities").Category>;
    update(id: string, dto: UpdateCategoryDto): Promise<import("../../database/entities").Category>;
    remove(id: string): Promise<void>;
    findAll(): Promise<import("../../database/entities").Category[]>;
    findBooks(id: string): Promise<import("../../database/entities").Category>;
}
