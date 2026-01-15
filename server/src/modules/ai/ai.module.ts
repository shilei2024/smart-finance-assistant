import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { AiProviderService } from './services/ai-provider.service';
import { DatabaseModule } from '../../shared/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [AiController],
  providers: [AiService, AiProviderService],
  exports: [AiService],
})
export class AiModule {}