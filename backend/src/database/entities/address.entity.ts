import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/baseEntity';
import { User } from './user.entity';

@Entity('addresses')
export class Address extends BaseEntity {
  @Column({ name: 'user_id' })
  @Index()
  userId: string;

  @Column()
  street: string;

  @Column()
  city: string;

  @Column({ name: 'zip_code' })
  zipCode: string;

  @Column()
  country: string;

  @Column({ name: 'is_default', default: false })
  isDefault: boolean;

  // Relations
  @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
