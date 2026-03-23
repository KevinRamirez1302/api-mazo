import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { Pool } from 'pg';

@Module({
  controllers: [UsuariosController],
  providers: [UsuariosService, Pool],
})
export class UsuariosModule { }
