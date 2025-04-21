import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { AvailableShowing } from '../../../booking-service/src/entities/available-showing.entity';

@Entity()
export class Theater {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  capacity: number;

  @OneToMany(() => AvailableShowing, showing => showing.theater)
  showings: AvailableShowing[];
}