import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appraisal } from './entities/appraisal.entity';
import { AppraisalsService } from './appraisals.service';
import { AppraisalsController } from './appraisals.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Appraisal])],
  providers: [AppraisalsService],
  controllers: [AppraisalsController],
  exports: [AppraisalsService],
})
export class AppraisalsModule {}
