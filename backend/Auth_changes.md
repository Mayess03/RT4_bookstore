# To change : Auth 

---

## Message à Envoyer

```


J'ai vérifié la branche auth et il y a quelques modifications à faire pour que tout soit compatible avec notre structure commune (PostgreSQL, entities, etc.).

Ceci est un rapport détaillé avec le code exact à mettre. Peux-tu faire ces 4 modifications sur ta branche auth ?

📎 Voir le fichier : INCOMPATIBILITY_REPORT.md
```

---

## 🎯 Ce Qu'Elle Doit Faire EXACTEMENT

### ✅ Action 1 : Créer le fichier manquant

**Créer** : `src/auth/decorators/roles.decorator.ts`

```typescript
import { SetMetadata } from '@nestjs/common';
import { Role } from '../../common/enums/role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
```

---

### ✅ Action 2 : Corriger RolesGuard

**Modifier** : `src/auth/guards/roles.guard.ts`

**Remplacer tout le contenu par :**

```typescript
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
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}
```

**Changement principal :** 
- ❌ `constructor(private readonly role: string)` 
- ✅ `constructor(private reflector: Reflector)`

---

### ✅ Action 3 : Changer MySQL → PostgreSQL

**Modifier** : `src/app.module.ts`

**Trouver ces lignes :**
```typescript
TypeOrmModule.forRoot({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  autoLoadEntities: true,
  synchronize: true,
}),
```

**Remplacer par :**
```typescript
TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',  // ← Changé de mysql à postgres
    host: configService.get('DB_HOST', 'localhost'),
    port: configService.get<number>('DB_PORT', 5432),
    username: configService.get('DB_USERNAME', 'postgres'),  // ← DB_USER → DB_USERNAME
    password: configService.get('DB_PASSWORD', 'postgres'),  // ← DB_PASS → DB_PASSWORD
    database: configService.get('DB_NAME', 'bookstore'),
    entities: [User, Book, Category, Order, OrderItem, Cart, CartItem, Review, Wishlist, Address],
    synchronize: configService.get('NODE_ENV') !== 'production',
    logging: configService.get('NODE_ENV') === 'development',
  }),
}),
```

**Note importante :** Il faudra importer ConfigService en haut du fichier si ce n'est pas déjà fait :
```typescript
import { ConfigModule, ConfigService } from '@nestjs/config';
```

---

### ✅ Action 4 : 🚨 CRITIQUE : Corriger la Structure des Entities

**⚠️ PROBLÈME MAJEUR DÉTECTÉ** : La branche `auth` utilise une structure d'entities incompatible avec le projet.

#### 🔴 Problèmes dans la branche auth :

1. **Mauvais chemin** : `src/entities/` au lieu de `src/database/entities/`
2. **BaseEntity incompatible** :
   - ❌ Pas de `@PrimaryGeneratedColumn('uuid')`
   - ❌ Colonnes en camelCase au lieu de snake_case
   - ❌ N'étend pas `TypeOrmBaseEntity`
3. **User entity incomplète** :
   - ❌ `@PrimaryGeneratedColumn('uuid')` dupliqué (déjà dans BaseEntity)
   - ❌ Manque TOUTES les relations : Orders, Cart, Reviews, Wishlist, Address

#### ✅ CE QU'IL FAUT FAIRE :

**1. Supprimer le dossier `src/entities/` complètement**

**2. Créer le bon dossier et utiliser la structure commune :**

```bash
mkdir -p src/database/entities
mkdir -p src/common/entities
```

**3. Utiliser le BaseEntity commun** : `src/common/entities/baseEntity.ts`

```typescript
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { BaseEntity as TypeOrmBaseEntity } from 'typeorm';

export abstract class BaseEntity extends TypeOrmBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
```

**4. Corriger User entity** : `src/database/entities/user.entity.ts`

```typescript
import { Entity, Column, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/baseEntity';
import { Role } from '../../common/enums/role.enum';
import { Order } from './order.entity';
import { Cart } from './cart.entity';
import { Review } from './review.entity';
import { Wishlist } from './wishlist.entity';
import { Address } from './address.entity';

@Entity('users')
export class User extends BaseEntity {
  // ❌ SUPPRIMER : @PrimaryGeneratedColumn('uuid') id: string;
  // ✅ L'id vient déjà de BaseEntity !

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  // ✅ AJOUTER toutes les relations :
  @OneToMany(() => Order, (order) => order.user, { cascade: true })
  orders: Order[];

  @OneToOne(() => Cart, (cart) => cart.user, { cascade: true })
  cart: Cart;

  @OneToMany(() => Review, (review) => review.user, { cascade: true })
  reviews: Review[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.user, { cascade: true })
  wishlists: Wishlist[];

  @OneToMany(() => Address, (address) => address.user, { cascade: true })
  addresses: Address[];
}
```

**5. Mettre à jour TOUS les imports dans auth/**

Remplacer :
```typescript
import { User } from '../entities/user.entity';
```

Par :
```typescript
import { User } from '../database/entities/user.entity';
```

**6. Corriger le chemin de Role enum :**
```typescript
// ❌ import { Role } from '../common/enum/role.enum';
// ✅ import { Role } from '../common/enums/role.enum';  (enums au pluriel)
```

---

### ✅ Action 5 : Ajouter BooksModule dans app.module.ts

**Dans** : `src/app.module.ts`

**Ajouter l'import :**
```typescript
import { BooksModule } from './modules/books/books.module';
```

**Dans le tableau `imports` du @Module :**
```typescript
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ ... }),
    UsersModule,
    AuthModule,
    AdminModule,
    BooksModule,  // ← Ajouter cette ligne
  ],
  // ...
})
```

---

## ✅ Action 6 : Tester que ça compile

```bash
npm run start:dev
```

**Doit démarrer sans erreur !**

---

## 📋 Checklist Rapide

- [ ] 🚨 **CRITIQUE** : Supprimer `src/entities/` et utiliser `src/database/entities/`
- [ ] 🚨 **CRITIQUE** : Corriger User entity (supprimer id dupliqué, ajouter relations)
- [ ] 🚨 **CRITIQUE** : Mettre à jour tous les imports vers `database/entities/`
- [ ] Créer `roles.decorator.ts`
- [ ] Corriger `roles.guard.ts` (ajouter Reflector)
- [ ] Changer `mysql` → `postgres` dans app.module.ts
- [ ] Changer `DB_USER` → `DB_USERNAME` et `DB_PASS` → `DB_PASSWORD`
- [ ] Corriger chemin enum : `common/enum/` → `common/enums/`
- [ ] Ajouter `BooksModule` dans les imports
- [ ] Tester `npm run start:dev`
- [ ] Push la branche auth corrigée

---

## 🚀 Une Fois Fait

**Elle te dit :** "C'est fait !"

**Tu fais :**
```bash
git fetch origin
git merge origin/auth
```

Et c'est bon ! ✅

---🚨 **Entities Structure** : CRITIQUE - Sans corriger ça, impossible d'avoir des relations entre User/Orders/Cart/Reviews. Tout le projet utilise `src/database/entities/` avec BaseEntity contenant UUID
2. **Reflector** : Permet de lire les métadonnées de `@Roles(Role.ADMIN)`
3. **PostgreSQL** : C'est la DB qu'on utilise dans le projet (pas MySQL)
4. **Variables .env** : On suit tous le même standard (`DB_USERNAME` pas `DB_USER`)
5
1. **Reflector** : Permet de lire les métadonnées de `@Roles(Role.ADMIN)`
2. **PostgreSQL** : C'est la DB qu'on utilise dans le projet (pas MySQL)
3. **Variables .env** : On suit tous le même standard (`DB_USERNAME` pas `DB_USER`)
4. **BooksModule** : Pour que ton module Books soit intégré

Sans ces changements, l'app ne compilera pas ou ne fonctionnera pas correctement.

---


