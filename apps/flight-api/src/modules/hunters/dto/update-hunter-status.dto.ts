import { HunterStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class UpdateHunterStatusDto {
  @ApiProperty({ enum: HunterStatus })
  @IsEnum(HunterStatus)
  status!: HunterStatus;
}
