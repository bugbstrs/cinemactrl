import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsNotEmpty, Min, IsUrl, IsDateString, IsOptional } from 'class-validator';

export class UpdateMovieDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @IsOptional()
  ageRating?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  @IsOptional()
  duration?: number;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  releaseDate?: string;
}