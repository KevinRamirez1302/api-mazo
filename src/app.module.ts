import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PersonasModule } from './personas/personas.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsuariosModule,
    PersonasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
