import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from '../../database/entities';
import { Book } from '../../database/entities';

@Injectable()
export class WishlistService {
    constructor(
        @InjectRepository(Wishlist)
        private readonly wishlistRepository: Repository<Wishlist>,

        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>,
    ) { }

    async addBook(userId: string, bookId: string) {
        // Vérifie que le livre existe
        const book = await this.bookRepository.findOne({ where: { id: bookId } });
        if (!book) throw new NotFoundException('Livre non trouvé');

        // Vérifie si le livre est déjà dans la wishlist
        const existing = await this.wishlistRepository.findOne({
            where: { userId, bookId },
        });
        if (existing) return existing;

        return this.wishlistRepository.save({
            userId,
            bookId,
        });
    }

    async removeBook(userId: string, bookId: string) {
        const existing = await this.wishlistRepository.findOne({
            where: { userId, bookId },
        });
        if (!existing) throw new NotFoundException('Livre non trouvé dans la wishlist');

        return this.wishlistRepository.remove(existing);
    }

    async getUserWishlist(userId: string) {
        return this.wishlistRepository.find({
            where: { userId },
            relations: ['book'], // permet de récupérer les infos du livre
        });
    }
}
