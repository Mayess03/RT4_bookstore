import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from 'src/common/enums';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('stats')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class StatsController {
    constructor(private readonly statsService: StatsService) { }

    // DASH-01 : GET GLOBAL STATS
    @Get('global')
    async getGlobalStats() {
        return this.statsService.getStats();
    }

    // DASH-02 : Chiffre d'affaires total
    @Get('revenue')
    async getRevenue() {
        return this.statsService.getRevenue();
    }

    // DASH-03 : Graphiques des ventes (par jour/mois)
    @Get('sales/day')
    async getSalesByDay() {
        return this.statsService.getSalesByDay();
    }

    @Get('sales/month')
    async getSalesByMonth() {
        return this.statsService.getSalesByMonth();
    }

    // DASH-04 : Top 5 des livres les plus vendus => deja t existi dans books.controller.ts (bestsellers)

    // DASH-05 : Livres en rupture de stock
    @Get('out-of-stock')
    async getOutOfStockBooks() {
        return this.statsService.getOutOfStockBooks();
    }

    // DASH-06 : Nouvelles commandes (temps réel) avec websockets => voir orders.gateway.ts

    // DASH-07 : Répartition des livres par catégorie
    @Get('books-by-category')
    async getBooksByCategory() {
        return this.statsService.getBooksByCategory();
    }
    @Get('orders/pending')
    async getPendingOrders() {
        return this.statsService.getPendingOrdersCount();
    }

}

