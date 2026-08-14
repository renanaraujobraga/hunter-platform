import { PartialType } from '@nestjs/swagger';
import { CreateHunterDto } from './create-hunter.dto';

export class UpdateHunterDto extends PartialType(CreateHunterDto) {}
