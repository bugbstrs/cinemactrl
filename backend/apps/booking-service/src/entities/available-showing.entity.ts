import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Theater } from '../../../backend/src/entities/theater.entity';
import { Movie } from '../../../backend/src/entities/movie.entity';
import { Reservation } from '../../../booking-service/src/entities/reservation.entity';

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