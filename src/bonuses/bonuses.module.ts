import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BonusesService } from './bonuses.service';
import { BonusesController } from './bonuses.controller';
import { Bonus } from './entities/bonus.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bonus]),
    AuthModule
  ],
  controllers: [BonusesController],
  providers: [BonusesService],
})
export class BonusesModule {}
