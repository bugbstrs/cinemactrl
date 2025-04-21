import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Rating } from '../../../backend/src/entities/rating.entity';
import { Reservation } from '../../../booking-service/src/entities/reservation.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  fullName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER
  })
  role: UserRole;

  @OneToMany(() => Rating, rating => rating.user)
  ratings: Rating[];

  @OneToMany(() => Reservation, reservation => reservation.user)
  reservations: Reservation[];
}