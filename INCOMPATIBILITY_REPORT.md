# 🚨 RAPPORT D'INCOMPATIBILITÉ - Branche AUTH

## ❌ PROBLÈMES CRITIQUES DÉTECTÉS

### 1. 🔴 RolesGuard Non Fonctionnel (BLOQUANT)

**Problème:** Le `RolesGuard` actuel ne peut PAS être utilisé avec ton module Books.

**Code actuel (INCORRECT):**
```typescript
export class RolesGuard implements CanActivate {
  constructor(private readonly role: string) {}  // ❌ Prend le rôle en paramètre
  
  canActivate(context: ExecutionContext): boolean {
    const user = request.user;
    if (!user || user.role !== this.role) {
      throw new ForbiddenException('Access denied');
    }
    return true;
  }
}
```

**Pourquoi c'est bloquant:**
- Impossible d'utiliser `@UseGuards(JwtAuthGuard, RolesGuard)` car RolesGuard attend un paramètre
- Pas de décorateur `@Roles()` disponible
- Obligerait à faire `new RolesGuard('admin')` à chaque fois (anti-pattern)

---

### 2. 🔴 Décorateur @Roles Manquant (BLOQUANT)

**Statut:** ❌ **N'EXISTE PAS**

```bash
fatal: path 'src/auth/decorators/roles.decorator.ts' does not exist in 'origin/auth'
```

**Impact:**
- Tu ne peux pas utiliser `@Roles(Role.ADMIN)` dans tes controllers
- Aucun moyen propre de définir les permissions

---

### 3. 🔴 Base de Données Incompatible (CRITIQUE)

**Ton projet:** PostgreSQL  
**Branche auth:** MySQL

```typescript
// Branche AUTH (MySQL)
TypeOrmModule.forRoot({
  type: 'mysql',  // ❌ Incompatible
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,    // ❌ Variables .env différentes
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  autoLoadEntities: true,
  synchronize: true,
})
```

```typescript
// Ta branche BOOKS (PostgreSQL)
TypeOrmModule.forRoot({
  type: 'postgres',  // ✅ Correct
  host: configService.get('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get('DB_USERNAME'),  // ✅ Ton naming
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  entities: [User, Book, Category, ...],  // ✅ Explicite
  synchronize: configService.get('NODE_ENV') !== 'production',
})
```

**Différences:**
- Type DB différent (MySQL vs PostgreSQL)
- Noms des variables d'environnement différents (`DB_USER` vs `DB_USERNAME`)
- `autoLoadEntities: true` vs entités explicites
- Pas de ConfigService utilisé dans auth

---

### 4. 🟠 Structure des Entities Différente

**À vérifier:**
```bash
git show origin/auth:src/entities/user.entity.ts
git show origin/auth:src/entities/base.entity.ts
```

Compare avec:
```bash
cat src/database/entities/user.entity.ts
cat src/common/entities/baseEntity.ts
```

**Risques:**
- Structure de User différente
- BaseEntity incompatible
- Relations manquantes (Cart, Orders, Reviews, etc.)

---

### 5. 🟡 Variables d'Environnement Incompatibles

**Branche AUTH attend:**
```env
DB_HOST=
DB_PORT=
DB_USER=        # ❌ Différent
DB_PASS=        # ❌ Différent
DB_NAME=
```

**Ton projet utilise:**
```env
DB_HOST=
DB_PORT=
DB_USERNAME=    # ✅ Ton standard
DB_PASSWORD=    # ✅ Ton standard
DB_NAME=
```

---

## 🛠️ SOLUTIONS PROPOSÉES

### Solution 1: Corriger la Branche AUTH (RECOMMANDÉ)

Demande à ton camarade de faire ces modifications sur la branche `auth`:

#### A. Créer le décorateur @Roles

```typescript
// src/auth/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { Role } from '../../common/enums/role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
```

#### B. Corriger le RolesGuard

```typescript
// src/auth/guards/roles.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../common/enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // Pas de rôles requis = accès public
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        `Access denied. Required roles: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
```

#### C. Changer MySQL → PostgreSQL dans app.module.ts

```typescript
// src/app.module.ts (branche auth)
import { ConfigModule, ConfigService } from '@nestjs/config';

TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',  // ✅ Changer de mysql à postgres
    host: configService.get('DB_HOST', 'localhost'),
    port: configService.get<number>('DB_PORT', 5432),
    username: configService.get('DB_USERNAME', 'postgres'),  // ✅ DB_USERNAME
    password: configService.get('DB_PASSWORD', 'postgres'),  // ✅ DB_PASSWORD
    database: configService.get('DB_NAME', 'bookstore'),
    entities: [User, Book, Category, Order, OrderItem, Cart, CartItem, Review, Wishlist, Address],
    synchronize: configService.get('NODE_ENV') !== 'production',
    logging: configService.get('NODE_ENV') === 'development',
  }),
}),
```

#### D. Harmoniser les Entities

```bash
# Ton camarade doit utiliser VOTRE structure d'entities commune
git show origin/books:src/database/entities/user.entity.ts
```

S'assurer que User a bien:
- UUID comme PK
- Relations avec Cart, Orders, Reviews, Wishlist, Address
- BaseEntity commun

---

### Solution 2: Créer une Branche de Merge Propre

Si ton camarade ne peut pas corriger immédiatement:

```bash
# 1. Créer une branche de merge depuis books
git checkout books
git checkout -b merge/auth-books

# 2. Merger auth (il y aura des conflits)
git merge origin/auth

# 3. Résoudre les conflits en gardant:
#    - PostgreSQL (pas MySQL)
#    - Tes variables d'environnement
#    - Ta structure d'entities
#    - Tes modules (BooksModule)

# 4. Ajouter les fichiers manquants:
#    - roles.decorator.ts
#    - RolesGuard corrigé

# 5. Tester
npm install
npm run start:dev
```

---

## 📋 CHECKLIST AVANT MERGE

### Avant de merger auth avec books:

- [ ] RolesGuard utilise `Reflector` (pas `constructor(role: string)`)
- [ ] Décorateur `@Roles()` existe dans `src/auth/decorators/`
- [ ] Database type = `postgres` (pas `mysql`)
- [ ] Variables .env = `DB_USERNAME` et `DB_PASSWORD` (pas `DB_USER/DB_PASS`)
- [ ] Entities utilisent la même BaseEntity (UUID, timestamps, soft delete)
- [ ] User entity a toutes les relations (Cart, Orders, Reviews, etc.)
- [ ] AuthModule est compatible avec BooksModule
- [ ] Les imports dans app.module.ts incluent TOUS les modules

---

## 🧪 TEST DE COMPATIBILITÉ

Une fois corrigé, teste avec:

```bash
# 1. Démarrer l'app
npm run start:dev

# 2. Tester l'auth
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bookstore.com","password":"admin123"}'

# Récupère le token

# 3. Tester un endpoint admin Books
curl -X POST http://localhost:3000/api/books \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Book",
    "author": "Test Author",
    "isbn": "123-456-789",
    "price": 29.99,
    "stock": 10,
    "description": "Test"
  }'

# Devrait retourner 201 Created (pas 403 Forbidden)
```

---

## 🎯 RECOMMANDATION FINALE

**Option A (MEILLEURE):** Demande à ton camarade de corriger la branche `auth`:
1. Ajouter `roles.decorator.ts`
2. Corriger `RolesGuard` avec `Reflector`
3. Changer MySQL → PostgreSQL
4. Harmoniser les variables .env
5. Utiliser votre structure d'entities commune

**Option B:** Créer une branche de merge et corriger toi-même les incompatibilités

**⚠️ NE PAS MERGER** sans corriger ces problèmes = l'app ne fonctionnera pas !

---

## 📞 Message à Envoyer à Ton Camarade

```
Salut ! J'ai vérifié ta branche auth et j'ai trouvé quelques incompatibilités avec notre structure:

🔴 Problèmes bloquants:
1. RolesGuard utilise constructor(role: string) au lieu de Reflector
2. Décorateur @Roles() n'existe pas
3. Tu utilises MySQL alors qu'on utilise PostgreSQL
4. Variables .env différentes (DB_USER vs DB_USERNAME)

📁 Fichiers à corriger:
- src/auth/guards/roles.guard.ts (ajouter Reflector)
- src/auth/decorators/roles.decorator.ts (créer le fichier)
- src/app.module.ts (mysql → postgres, DB_USER → DB_USERNAME)

Je t'ai préparé le code correct dans INCOMPATIBILITY_REPORT.md.
On peut en discuter pour que tout soit compatible avant le merge.
```

---

Besoin d'aide pour corriger ou merger ? 🚀
