import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsUUID,
  Min,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

export class QueryBookDto {
  @ApiPropertyOptional({ example: 1, description: 'Page number', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    description: 'Number of items per page',
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({
    example: 'Clean Code',
    description: 'Rechercher par titre',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    example: 'Robert Martin',
    description: 'Filtrer par auteur',
  })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiPropertyOptional({
    example: '978-0132350884',
    description: 'Rechercher par ISBN',
  })
  @IsOptional()
  @IsString()
  isbn?: string;

  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Filtrer par catégorie',
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ example: 10, description: 'Prix minimum' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ example: 50, description: 'Prix maximum' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({
    example: 'price',
    description: 'Trier par: price, createdAt, title, rating',
    enum: ['price', 'createdAt', 'title', 'rating', 'bestseller'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['price', 'createdAt', 'title', 'rating', 'bestseller'])
  sortBy?: string;

  @ApiPropertyOptional({
    example: 'ASC',
    description: 'Ordre de tri',
    enum: ['ASC', 'DESC'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC' = 'ASC';
}
