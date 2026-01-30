# 📚 Bookstore Backend API

Backend NestJS pour une plateforme de librairie en ligne avec TypeORM et PostgreSQL.

## 🛠️ Stack Technique

- **Framework**: NestJS 11
- **ORM**: TypeORM 0.3
- **Database**: PostgreSQL 16
- **Auth**: Passport JWT
- **Validation**: class-validator
- **Documentation**: Swagger

## 🚀 Quick Start

```bash
npm install                # 1. Installer les dépendances
docker-compose up -d       # 2. Démarrer PostgreSQL
npm run start:dev          # 3. Démarrer l'application
npm run seed               # 4. Insérer les données de test
```

**API**: http://localhost:3000  
**Swagger**: http://localhost:3000/api/docs  
**pgAdmin**: http://localhost:5050 (admin@bookstore.com / admin)

## 🔐 Comptes de Test

| Email | Password | Role |
|-------|----------|------|
| admin@bookstore.com | admin123 | ADMIN |


## 🗄️ Entities (10)

1. **User** - Utilisateurs avec rôles (ADMIN/USER)
2. **Book** - Livres avec prix, stock, ISBN
3. **Category** - Catégories de livres
4. **Order** - Commandes avec statuts
5. **OrderItem** - Articles commandés
6. **Cart** - Panier utilisateur
7. **CartItem** - Articles du panier
8. **Review** - Avis sur les livres (1-5 étoiles)
9. **Wishlist** - Liste de souhaits
10. **Address** - Adresses de livraison

**Relations**: UUID, timestamps, soft delete, CASCADE/RESTRICT appropriés


## 📝 Scripts Disponibles

```bash
npm run start:dev      # Mode développement avec watch
npm run start:prod     # Mode production
npm run build          # Compiler
npm run seed           # Insérer données de test
npm run lint           # Vérifier le code
npm run test           # Tests unitaires
npm run test:e2e       # Tests e2e
```

## 🔧 Configuration (.env)

```env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=bookstore

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=7d
```

## 📁 Structure

```
src/
├── common/
│   ├── entities/       # BaseEntity (UUID, timestamps, soft delete)
│   └── enums/         # Role, OrderStatus
├── database/
│   ├── entities/      # 10 entities TypeORM
│   └── seeds/         # Script de seed
├── app.module.ts      # Configuration TypeORM
└── main.ts            # Bootstrap (CORS, Swagger, Validation)
```


## 🐛 Troubleshooting

**Erreur de connexion DB:**
```bash
docker-compose down && docker-compose up -d
```

**Port déjà utilisé:**
Modifier `PORT` dans `.env` ou arrêter le processus.

**Erreur npm install:**
Le fichier `.npmrc` avec `legacy-peer-deps=true` résout les conflits.

## 📚 Ressources

- [NestJS Docs](https://docs.nestjs.com)
- [TypeORM Docs](https://typeorm.io)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
