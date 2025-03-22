import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards } from '@nestjs/common';
import { AppraisalsService } from './appraisals.service';
import { Appraisal, AppraisalStatus } from './entities/appraisal.entity';
import { CreateAppraisalDto } from './dto/create-appraisal.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('appraisals')
@UseGuards(JwtAuthGuard)
export class AppraisalsController {
  constructor(private readonly appraisalsService: AppraisalsService) {}

  @Post()
  create(@Body() createAppraisalDto: CreateAppraisalDto): Promise<Appraisal> {
    return this.appraisalsService.create(createAppraisalDto);
  }

  @Get()
  findAll(): Promise<Appraisal[]> {
    return this.appraisalsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Appraisal> {
    return this.appraisalsService.findOne(id);
  }

  @Get('employee/:employeeId')
  findByEmployee(@Param('employeeId') employeeId: string): Promise<Appraisal[]> {
    return this.appraisalsService.findByEmployee(employeeId);
  }

  @Get('manager/:managerId')
  findByManager(@Param('managerId') managerId: string): Promise<Appraisal[]> {
    return this.appraisalsService.findByManager(managerId);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: AppraisalStatus,
    @Body('managerComments') managerComments?: string,
  ): Promise<Appraisal> {
    return this.appraisalsService.updateStatus(id, status, managerComments);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.appraisalsService.remove(id);
  }
}
