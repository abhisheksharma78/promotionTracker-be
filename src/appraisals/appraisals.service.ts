import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appraisal, AppraisalStatus } from './entities/appraisal.entity';
import { CreateAppraisalDto } from './dto/create-appraisal.dto';

@Injectable()
export class AppraisalsService {
  constructor(
    @InjectRepository(Appraisal)
    private readonly appraisalsRepository: Repository<Appraisal>,
  ) {}

  create(createAppraisalDto: CreateAppraisalDto): Promise<Appraisal> {
    const appraisal = this.appraisalsRepository.create(createAppraisalDto);
    return this.appraisalsRepository.save(appraisal);
  }

  findAll(): Promise<Appraisal[]> {
    return this.appraisalsRepository.find({
      relations: ['employee', 'manager'],
    });
  }

  async findOne(id: string): Promise<Appraisal> {
    const appraisal = await this.appraisalsRepository.findOne({
      where: { id },
      relations: ['employee', 'manager'],
    });
    if (!appraisal) {
      throw new NotFoundException(`Appraisal with ID ${id} not found`);
    }
    return appraisal;
  }

  async findByEmployee(employeeId: string): Promise<Appraisal[]> {
    return this.appraisalsRepository.find({
      where: { employeeId },
      relations: ['employee', 'manager'],
    });
  }

  async findByManager(managerId: string): Promise<Appraisal[]> {
    return this.appraisalsRepository.find({
      where: { managerId },
      relations: ['employee', 'manager'],
    });
  }

  async updateStatus(
    id: string,
    status: AppraisalStatus,
    managerComments?: string,
  ): Promise<Appraisal> {
    const appraisal = await this.findOne(id);
    appraisal.status = status;
    if (managerComments) {
      appraisal.managerComments = managerComments;
    }
    return this.appraisalsRepository.save(appraisal);
  }

  async remove(id: string): Promise<void> {
    const result = await this.appraisalsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Appraisal with ID ${id} not found`);
    }
  }
}
