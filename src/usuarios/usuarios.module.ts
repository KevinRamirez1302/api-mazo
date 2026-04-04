import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { Pool } from 'pg';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'defaultSecretCode',
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService, Pool],
})
export class UsuariosModule { }
