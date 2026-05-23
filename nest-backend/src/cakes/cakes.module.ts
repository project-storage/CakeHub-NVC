import { Module } from '@nestjs/common';
import { CakesService } from './cakes.service';
import { CakesController } from './cakes.controller';

@Module({
  providers: [CakesService],
  controllers: [CakesController],
})
export class CakesModule {}
