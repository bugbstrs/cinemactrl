import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, Max } from 'class-validator';

export class CreateRatingDto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(10)
  rating: number;
}