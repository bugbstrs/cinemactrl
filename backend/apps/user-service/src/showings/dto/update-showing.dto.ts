import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';

export class UpdateShowingDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  theaterId?: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  movieId?: number;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  startTime?: string;
}