import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bonus } from './entities/bonus.entity';
import { BonusesService } from './bonuses.service';
import { BonusesController } from './bonuses.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Bonus])],
  providers: [BonusesService],
  controllers: [BonusesController],
  exports: [BonusesService],
})
export class BonusesModule {}
