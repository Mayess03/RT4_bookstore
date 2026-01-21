import { BaseEntity } from '../../common/entities/baseEntity';
import { Book } from './book.entity';
export declare class Category extends BaseEntity {
    name: string;
    description: string;
    books: Book[];
}
