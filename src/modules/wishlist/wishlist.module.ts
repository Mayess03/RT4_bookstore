import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { Wishlist } from '../../database/entities/wishlist.entity';
import { Book } from 'src/database/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wishlist, Book]),
  ],
  providers: [WishlistService],
  controllers: [WishlistController],
  exports: [WishlistService],
})
export class WishlistModule {}
