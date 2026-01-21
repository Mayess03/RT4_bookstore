import {
  Controller,
  Post,
  Patch,
  Delete,
  Get,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from 'src/common/enums';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // REV-01 : Laisser un avis (USER seulement)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  @Post(':bookId')
  addReview(
    @Req() req,
    @Param('bookId') bookId: string,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewsService.addReview(
      req.user.userId,
      bookId,
      dto,
    );
  }

  // REV-02 : Modifier son avis (USER + propriétaire)
  // l'utilisateur ne peut laisser qu'un seul avis par livre
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  @Patch(':bookId')
  updateReview(
    @Req() req,
    @Param('bookId') bookId: string,
    @Body() dto: UpdateReviewDto,
  ) {
    return this.reviewsService.updateReview(
      req.user.userId,
      bookId,
      dto,
    );
  }

  // REV-03 : Supprimer son avis (USER + propriétaire)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  @Delete(':bookId')
  removeReview(@Req() req, @Param('bookId') bookId: string) {
    return this.reviewsService.removeReview(req.user.userId, bookId);
  }

  // REV-04 : Voir les avis d’un livre (PUBLIC)
  @Get('book/:bookId')
  getReviewsByBook(@Param('bookId') bookId: string) {
    return this.reviewsService.getReviewsByBook(bookId);
  }
}
