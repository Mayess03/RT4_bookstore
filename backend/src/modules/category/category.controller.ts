import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // ==================== ENDPOINTS PUBLICS ====================

  /**
   * CAT-01: Afficher la liste des catégories
   */
  @Get()
  @ApiOperation({ summary: 'Liste toutes les catégories' })
  @ApiResponse({ status: 200, description: 'Liste des catégories récupérée' })
  @ApiQuery({ name: 'withBookCount', required: false, type: Boolean })
  findAll(@Query('withBookCount') withBookCount?: boolean) {
    return this.categoryService.findAll(withBookCount);
  }

  /**
   * CAT-02: Voir les détails d'une catégorie
   */
  @Get(':id')
  @ApiOperation({ summary: 'Détails d\'une catégorie' })
  @ApiResponse({ status: 200, description: 'Détails de la catégorie récupérés' })
  @ApiResponse({ status: 404, description: 'Catégorie non trouvée' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoryService.findOne(id);
  }

  /**
   * CAT-03: Voir les livres d'une catégorie
   */
  @Get(':id/books')
  @ApiOperation({ summary: 'Liste des livres d\'une catégorie' })
  @ApiResponse({ status: 200, description: 'Liste des livres récupérée' })
  @ApiResponse({ status: 404, description: 'Catégorie non trouvée' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  findBooks(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    return this.categoryService.findBooksByCategory(id, { limit, page });
  }

  // ==================== ENDPOINTS ADMIN ====================

  /**
   * CAT-04: Ajouter une nouvelle catégorie (ADMIN)
   */
  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '[ADMIN] Créer une nouvelle catégorie' })
  @ApiResponse({ status: 201, description: 'Catégorie créée avec succès' })
  @ApiResponse({ status: 409, description: 'Catégorie avec ce nom existe déjà' })
  create(@Body() dto: CreateCategoryDto) {
    return this.categoryService.create(dto);
  }

  /**
   * CAT-05: Modifier une catégorie (ADMIN)
   */
  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '[ADMIN] Modifier une catégorie' })
  @ApiResponse({ status: 200, description: 'Catégorie modifiée avec succès' })
  @ApiResponse({ status: 404, description: 'Catégorie non trouvée' })
  @ApiResponse({ status: 409, description: 'Catégorie avec ce nom existe déjà' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, dto);
  }

  /**
   * CAT-06: Supprimer une catégorie (ADMIN)
   */
  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[ADMIN] Supprimer une catégorie (soft delete)' })
  @ApiResponse({ status: 200, description: 'Catégorie supprimée avec succès' })
  @ApiResponse({ status: 404, description: 'Catégorie non trouvée' })
  @ApiResponse({
    status: 400,
    description: 'Impossible de supprimer une catégorie contenant des livres'
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoryService.remove(id);
  }

  /**
   * CAT-07: Obtenir les statistiques d'une catégorie (ADMIN)
   */
  @Get(':id/stats')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '[ADMIN] Statistiques d\'une catégorie' })
  @ApiResponse({ status: 200, description: 'Statistiques récupérées' })
  @ApiResponse({ status: 404, description: 'Catégorie non trouvée' })
  getStats(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoryService.getCategoryStats(id);
  }
}
