import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../../user-service/src/entities/user.entity';
import { AvailableShowing } from './available-showing.entity';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.reservations)
  @JoinColumn()
  user: User;

  @ManyToOne(() => AvailableShowing, showing => showing.reservations)
  @JoinColumn()
  showing: AvailableShowing;

  @Column()
  seat: string;
}