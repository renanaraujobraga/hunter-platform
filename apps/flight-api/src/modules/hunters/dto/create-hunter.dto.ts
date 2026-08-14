import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateHunterDto {
  @ApiProperty({ example: 'Florianópolis → Fortaleza' })
  @IsString()
  @MaxLength(120)
  name!: string;

  @ApiProperty({ example: 'FLN' })
  @IsString()
  @Length(3, 3)
  origin!: string;

  @ApiProperty({ example: 'FOR' })
  @IsString()
  @Length(3, 3)
  destination!: string;

  @ApiProperty()
  @IsDateString()
  departureFrom!: string;

  @ApiProperty()
  @IsDateString()
  departureTo!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  returnFrom?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  returnTo?: string;

  @ApiPropertyOptional({ example: 1200 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice?: number;
}
