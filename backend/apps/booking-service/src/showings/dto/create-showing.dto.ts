import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateShowingDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  theaterId: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  movieId: number;

  @ApiProperty()
  @IsDateString()
  startTime: string;
}