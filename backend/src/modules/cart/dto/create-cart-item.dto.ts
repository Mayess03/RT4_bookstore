import { IsUUID, IsInt, Min } from 'class-validator';

export class CreateCartItemDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  bookId: string;

  @IsInt()
  @Min(1)
  quantity: number; // optionnel, défaut à 1 dans le service
}
