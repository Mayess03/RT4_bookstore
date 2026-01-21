import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from 'src/database/entities';
import { Book } from 'src/database/entities';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>,

        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>,
    ) { }

    // Ajouter un avis
    async addReview(
        userId: string,
        bookId: string,
        dto: CreateReviewDto,
    ) {
        const book = await this.bookRepository.findOne({
            where: { id: bookId },
        });
        if (!book) throw new NotFoundException('Book not found');
        
        const existing = await this.reviewRepository.findOne({
            where: { userId, bookId },
        });

        if (existing) {
            throw new ConflictException('Vous avez déjà laissé un avis sur ce livre.');
        }
        return this.reviewRepository.save({
            userId,
            bookId,
            ...dto,
        });
    }

    // Modifier un avis (propriétaire seulement)
    async updateReview(
        userId: string,
        bookId: string,
        dto: UpdateReviewDto,
    ) {
        const review = await this.reviewRepository.findOne({
            where: { userId, bookId },
        });

        if (!review) throw new NotFoundException('Review not found');

        if (review.userId !== userId) {
            throw new ForbiddenException('Access denied');
        }

        Object.assign(review, dto);
        return this.reviewRepository.save(review);
    }

    // Supprimer un avis (propriétaire seulement)
    async removeReview(userId: string, bookId: string) {
        const review = await this.reviewRepository.findOne({
            where: { userId, bookId },
        });

        if (!review) throw new NotFoundException('Review not found');

        if (review.userId !== userId) {
            throw new ForbiddenException('Access denied');
        }

        await this.reviewRepository.remove(review);
        return { message: 'Review deleted successfully' };
    }

    // Voir avis d’un livre (public)
    async getReviewsByBook(bookId: string) {
        return this.reviewRepository.find({
            where: { bookId },
            relations: ['user'],
            order: { createdAt: 'DESC' },
        });
    }
}
