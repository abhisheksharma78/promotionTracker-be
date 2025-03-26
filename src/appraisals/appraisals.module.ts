import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppraisalsService } from './appraisals.service';
import { AppraisalsController } from './appraisals.controller';
import { Appraisal } from './entities/appraisal.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appraisal]),
    AuthModule
  ],
  controllers: [AppraisalsController],
  providers: [AppraisalsService],
})
export class AppraisalsModule {}
