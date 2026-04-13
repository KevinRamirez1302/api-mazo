import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PersonasModule } from './personas/personas.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ChatbotModule } from './chatbot/chatbot.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsuariosModule,
    PersonasModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: configService.get<string>('EMAIL'),
            pass: configService.get<string>('EMAILPASS'),
          },
        },
      }),
    }),
    ChatbotModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
