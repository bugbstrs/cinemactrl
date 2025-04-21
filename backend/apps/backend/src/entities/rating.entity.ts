import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Movie } from './movie.entity';
import { User } from '../../../user-service/src/entities/user.entity';

@Entity()
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Movie, movie => movie.ratings, { onDelete: 'CASCADE' })
  movie: Movie;

  @ManyToOne(() => User, user => user.ratings, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  rating: number;
}