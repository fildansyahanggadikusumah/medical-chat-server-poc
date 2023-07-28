import { Module } from '@nestjs/common';
import { AuthModule } from './module/auth/auth.module';

import { AuthController } from './controller/auth/auth.controller';
import { HistoryService } from './service/history/history.service';
import { HistoryController } from './controller/history/history.controller';

@Module({
  imports: [AuthModule],
  controllers: [AuthController, HistoryController],
  providers: [HistoryService],
})
export class AppModule {}
