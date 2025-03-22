import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bonus } from './entities/bonus.entity';
import { CreateBonusDto } from './dto/create-bonus.dto';
import { EmployeeBonus } from './dto/employee-bonus.dto';

@Injectable()
export class BonusesService {
  constructor(
    @InjectRepository(Bonus)
    private readonly bonusesRepository: Repository<Bonus>,
  ) {}

  create(createBonusDto: CreateBonusDto): Promise<Bonus> {
    const bonus = this.bonusesRepository.create(createBonusDto);
    return this.bonusesRepository.save(bonus);
  }

  findAll(): Promise<Bonus[]> {
    return this.bonusesRepository.find({
      relations: ['employee', 'approver'],
    });
  }

  async findOne(id: string): Promise<Bonus> {
    const bonus = await this.bonusesRepository.findOne({
      where: { id },
      relations: ['employee', 'approver'],
    });
    if (!bonus) {
      throw new NotFoundException(`Bonus with ID ${id} not found`);
    }
    return bonus;
  }

  async findByEmployee(employeeId: string): Promise<Bonus[]> {
    return this.bonusesRepository.find({
      where: { employeeId },
      relations: ['employee', 'approver'],
    });
  }

  async markAsPaid(id: string): Promise<Bonus> {
    const bonus = await this.findOne(id);
    bonus.isPaid = true;
    bonus.paidDate = new Date();
    return this.bonusesRepository.save(bonus);
  }

  async updateBatch(
    employeeBonuses: EmployeeBonus[],
    approverId: string,
  ): Promise<EmployeeBonus[]> {
    const currentYear = new Date().getFullYear();

    const promises = employeeBonuses.map(async (empBonus) => {
      const bonus = await this.bonusesRepository.findOne({
        where: { employeeId: empBonus.employeeId, year: currentYear },
        order: { createdAt: 'DESC' },
      });

      if (bonus) {
        // Store original values
        empBonus.originalBonus = bonus.amount;
        empBonus.originalIncrement = bonus.incrementPercentage;

        // Update with new values
        bonus.amount = empBonus.bonus;
        bonus.incrementPercentage = empBonus.increment;
        bonus.approverId = approverId;
        await this.bonusesRepository.save(bonus);
      } else {
        // Create new bonus record
        const newBonus = this.bonusesRepository.create({
          employeeId: empBonus.employeeId,
          approverId: approverId,
          amount: empBonus.bonus,
          incrementPercentage: empBonus.increment,
          year: currentYear,
          reason: `Annual review ${currentYear}`,
          effectiveDate: new Date(),
        });
        await this.bonusesRepository.save(newBonus);
      }

      return empBonus;
    });

    return Promise.all(promises);
  }

  async remove(id: string): Promise<void> {
    const result = await this.bonusesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Bonus with ID ${id} not found`);
    }
  }
}
