import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { Review } from 'src/database/entities';
import { Book } from 'src/database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Book])],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}