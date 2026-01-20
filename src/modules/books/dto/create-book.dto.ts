import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsOptional,
  IsInt,
  Min,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateBookDto {
  @ApiProperty({ example: 'Clean Code', description: 'Titre du livre' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({ example: 'Robert C. Martin', description: 'Auteur du livre' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  author: string;

  @ApiProperty({
    example: 'Un guide sur les bonnes pratiques de programmation',
    description: 'Description du livre',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 29.99, description: 'Prix du livre' })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ example: '978-0132350884', description: 'ISBN du livre' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  isbn: string;

  @ApiProperty({ example: 50, description: 'Stock disponible' })
  @IsInt()
  @Min(0)
  stock: number;

  @ApiProperty({
    example: 'https://example.com/cover.jpg',
    description: 'URL de l\'image de couverture',
    required: false,
  })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID de la catégorie',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;
}
