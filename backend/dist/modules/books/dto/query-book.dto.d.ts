export declare class QueryBookDto {
    page?: number;
    limit?: number;
    search?: string;
    author?: string;
    isbn?: string;
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    order?: 'ASC' | 'DESC';
}
