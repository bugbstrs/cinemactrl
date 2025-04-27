import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsNotEmpty, Min, IsOptional } from 'class-validator';

export class UpdateTheaterDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  @IsOptional()
  capacity?: number;
}