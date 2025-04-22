import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateReservationDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  showingId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  seat: string;
}