import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database.module';
import { PersonasService } from './personas.service';
import { PersonasController } from './personas.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [PersonasController],
  providers: [PersonasService],
})
export class PersonasModule {}
