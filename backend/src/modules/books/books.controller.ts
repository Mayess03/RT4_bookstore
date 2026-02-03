import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BooksService } from './books.service';
import { CreateBookDto, UpdateBookDto, QueryBookDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  /**
   * BOOK-01: Afficher la liste des livres avec pagination
   * BOOK-03: Rechercher des livres (titre, auteur, ISBN)
   * BOOK-04: Filtrer par catégorie
   * BOOK-05: Filtrer par prix (min-max)
   * BOOK-06: Trier (prix, date, popularité, note)
   */
  @Get()
  @ApiOperation({ summary: 'Liste tous les livres avec filtres et pagination' })
  @ApiResponse({ status: 200, description: 'Liste des livres récupérée' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'author', required: false, type: String })
  @ApiQuery({ name: 'isbn', required: false, type: String })
  @ApiQuery({ name: 'categoryId', required: false, type: String })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['price', 'createdAt', 'title', 'rating', 'bestseller'],
  })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC', 'DESC'] })
  findAll(@Query() queryDto: QueryBookDto) {
    return this.booksService.findAll(queryDto);
  }

  /**
   * BOOK-07: Voir les livres les plus vendus
   */
  @Get('bestsellers')
  @ApiOperation({ summary: 'Top 10 des livres les plus vendus' })
  @ApiResponse({ status: 200, description: 'Liste des bestsellers' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  getBestSellers(@Query('limit') limit?: number) {
    return this.booksService.getBestSellers(limit || 10);
  }

  /**
   * BOOK-08: Voir les nouveautés
   */
  @Get('new-arrivals')
  @ApiOperation({ summary: 'Derniers livres ajoutés (nouveautés)' })
  @ApiResponse({ status: 200, description: 'Liste des nouveautés' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  getNewArrivals(@Query('limit') limit?: number) {
    return this.booksService.getNewArrivals(limit || 10);
  }

  /**
   * Get all categories
   */
  @Get('categories')
  @ApiOperation({ summary: 'Liste de toutes les catégories de livres' })
  @ApiResponse({ status: 200, description: 'Liste des catégories récupérée' })
  getCategories() {
    return this.booksService.getCategories();
  }

  /**
   * BOOK-02: Voir les détails d'un livre
   * BOOK-09: Consulter les avis sur un livre
   */
  @Get(':id')
  @ApiOperation({ summary: 'Détails d\'un livre avec ses avis' })
  @ApiResponse({ status: 200, description: 'Détails du livre récupérés' })
  @ApiResponse({ status: 404, description: 'Livre non trouvé' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.booksService.findOne(id);
  }

  /**
   * BOOK-10: Ajouter un nouveau livre (ADMIN)
   */
  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '[ADMIN] Créer un nouveau livre' })
  @ApiResponse({ status: 201, description: 'Livre créé avec succès' })
  @ApiResponse({ status: 409, description: 'ISBN déjà existant' })
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  /**
   * BOOK-11: Modifier un livre existant (ADMIN)
   */
  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '[ADMIN] Modifier un livre' })
  @ApiResponse({ status: 200, description: 'Livre modifié avec succès' })
  @ApiResponse({ status: 404, description: 'Livre non trouvé' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return this.booksService.update(id, updateBookDto);
  }

  /**
   * BOOK-12: Supprimer un livre (ADMIN)
   */
  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[ADMIN] Supprimer un livre (soft delete)' })
  @ApiResponse({ status: 200, description: 'Livre supprimé avec succès' })
  @ApiResponse({ status: 404, description: 'Livre non trouvé' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.booksService.remove(id);
  }

  /**
   * BOOK-14: Gérer le stock (quantités) (ADMIN)
   */
  @Patch(':id/stock')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '[ADMIN] Mettre à jour le stock d\'un livre' })
  @ApiResponse({ status: 200, description: 'Stock mis à jour' })
  @ApiResponse({ status: 400, description: 'Stock insuffisant' })
  updateStock(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('quantity') quantity: number,
  ) {
    return this.booksService.updateStock(id, quantity);
  }

  /**
   * BOOK-15: Activer/Désactiver un livre (ADMIN)
   */
  @Patch(':id/toggle-active')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '[ADMIN] Activer/Désactiver un livre' })
  @ApiResponse({ status: 200, description: 'Statut du livre modifié' })
  toggleActive(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('isActive') isActive: boolean,
  ) {
    return this.booksService.toggleActive(id, isActive);
  }

  /**
   * Vérifier la disponibilité du stock
   */
  @Get(':id/check-stock')
  @ApiOperation({ summary: 'Vérifier la disponibilité du stock' })
  @ApiResponse({ status: 200, description: 'Disponibilité vérifiée' })
  @ApiQuery({ name: 'quantity', required: true, type: Number })
  checkStock(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('quantity') quantity: number,
  ) {
    return this.booksService.checkStock(id, quantity);
  }
}
