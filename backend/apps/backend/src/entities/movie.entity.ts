import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Rating } from './rating.entity';
import { AvailableShowing } from '../../../booking-service/src/entities/available-showing.entity';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  ageRating: number;

  @Column('text')
  description: string;

  @Column()
  imageUrl: string;

  @Column()
  duration: number;

  @Column('date')
  releaseDate: Date;

  @OneToMany(() => Rating, rating => rating.movie)
  ratings: Rating[];

  @OneToMany(() => AvailableShowing, showing => showing.movie)
  showings: AvailableShowing[];
}