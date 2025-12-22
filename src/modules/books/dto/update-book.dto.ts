import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateBookDto } from './create-book.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateBookDto extends PartialType(CreateBookDto) {
  @ApiProperty({
    example: true,
    description: 'Activer/Désactiver le livre',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
