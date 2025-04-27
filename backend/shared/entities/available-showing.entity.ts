import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Theater } from './theater.entity';
import { Movie } from './movie.entity';
import { Reservation } from './reservation.entity';

@Entity()
export class AvailableShowing {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Theater, theater => theater.showings)
  theater: Theater;

  @ManyToOne(() => Movie, movie => movie.showings)
  movie: Movie;

  @Column('timestamp')
  startTime: Date;

  @OneToMany(() => Reservation, reservation => reservation.showing)
  reservations: Reservation[];
}