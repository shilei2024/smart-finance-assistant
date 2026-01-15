import { Module } from '@nestjs/common';
import { BudgetsController } from './budgets.controller';
import { BudgetsService } from './budgets.service';
import { DatabaseModule } from '../../shared/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [BudgetsController],
  providers: [BudgetsService],
  exports: [BudgetsService],
})
export class BudgetsModule {}