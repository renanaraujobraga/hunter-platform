import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { UserContextService } from '../auth/user-context.service';
import { CreateHunterDto } from './dto/create-hunter.dto';
import { UpdateHunterDto } from './dto/update-hunter.dto';
import { UpdateHunterStatusDto } from './dto/update-hunter-status.dto';
import { HuntersService } from './hunters.service';

@ApiTags('Hunters')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('hunters')
export class HuntersController {
  constructor(
    private readonly huntersService: HuntersService,
    private readonly userContext: UserContextService,
  ) {}

  @Get()
  async list(@CurrentUser() user?: JwtPayload) {
    return this.huntersService.list(await this.userContext.resolveUserId(user));
  }

  @Get(':id')
  async findById(@Param('id') id: string, @CurrentUser() user?: JwtPayload) {
    return this.huntersService.findById(id, await this.userContext.resolveUserId(user));
  }

  @Get(':id/history')
  async history(@Param('id') id: string, @CurrentUser() user?: JwtPayload) {
    return this.huntersService.history(id, await this.userContext.resolveUserId(user));
  }

  @Post()
  async create(@Body() dto: CreateHunterDto, @CurrentUser() user?: JwtPayload) {
    return this.huntersService.create(dto, await this.userContext.resolveUserId(user));
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateHunterDto,
    @CurrentUser() user?: JwtPayload,
  ) {
    return this.huntersService.update(id, dto, await this.userContext.resolveUserId(user));
  }

  @Patch(':id/status')
  async setStatus(
    @Param('id') id: string,
    @Body() dto: UpdateHunterStatusDto,
    @CurrentUser() user?: JwtPayload,
  ) {
    return this.huntersService.setStatus(
      id,
      dto.status,
      await this.userContext.resolveUserId(user),
    );
  }

  @Post(':id/run')
  async run(@Param('id') id: string, @CurrentUser() user?: JwtPayload) {
    return this.huntersService.run(id, await this.userContext.resolveUserId(user));
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user?: JwtPayload) {
    return this.huntersService.remove(id, await this.userContext.resolveUserId(user));
  }
}
