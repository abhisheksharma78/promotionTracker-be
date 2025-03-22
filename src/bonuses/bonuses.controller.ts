import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards } from '@nestjs/common';
import { BonusesService } from './bonuses.service';
import { Bonus } from './entities/bonus.entity';
import { CreateBonusDto } from './dto/create-bonus.dto';
import { EmployeeBonus } from './dto/employee-bonus.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('bonuses')
@UseGuards(JwtAuthGuard)
export class BonusesController {
  constructor(private readonly bonusesService: BonusesService) {}

  @Post()
  create(@Body() createBonusDto: CreateBonusDto): Promise<Bonus> {
    return this.bonusesService.create(createBonusDto);
  }

  @Get()
  findAll(): Promise<Bonus[]> {
    return this.bonusesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Bonus> {
    return this.bonusesService.findOne(id);
  }

  @Get('employee/:employeeId')
  findByEmployee(@Param('employeeId') employeeId: string): Promise<Bonus[]> {
    return this.bonusesService.findByEmployee(employeeId);
  }

  @Post('batch')
  async updateBatch(
    @Body('bonuses') employeeBonuses: EmployeeBonus[],
    @Body('approverId') approverId: string,
  ): Promise<EmployeeBonus[]> {
    return this.bonusesService.updateBatch(employeeBonuses, approverId);
  }

  @Patch(':id/paid')
  markAsPaid(@Param('id') id: string): Promise<Bonus> {
    return this.bonusesService.markAsPaid(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.bonusesService.remove(id);
  }
}
