import { Controller, Post, Delete, Get, Param, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from 'src/common/enums';

@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.USER)
@Controller('wishlist')
export class WishlistController {
    constructor(private readonly wishlistService: WishlistService) { }

    // WISH-01 : Ajouter un livre aux favoris
    @Post(':bookId')
    addBook(@Req() req, @Param('bookId') bookId: string) {
        return this.wishlistService.addBook(req.user.userId, bookId);
    }

    // WISH-02 : Retirer un livre aux favoris
    @Delete(':bookId')
    removeBook(@Req() req, @Param('bookId') bookId: string) {
        return this.wishlistService.removeBook(req.user.userId, bookId);
    }

    // WISH-03 : Afficher la liste des livres favoris de l'utilisateur
    @Get()
    getWishlist(@Req() req) {
        return this.wishlistService.getUserWishlist(req.user.userId);
    }
}
