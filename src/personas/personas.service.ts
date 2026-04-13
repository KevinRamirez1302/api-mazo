import { Injectable, Inject, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { Pool } from 'pg';
import { MailerService } from '@nestjs-modules/mailer';
import { welcomeEmailTemplate } from './templates/welcome-email';

@Injectable()
export class PersonasService {
  constructor(@Inject('DATABASE_POOL') private pool: Pool, private mailerService: MailerService) { }

  async create(persona: CreatePersonaDto) {
    const { nombre, apellido, email, curso, mensaje, } = persona

    try {
      const query =
        'INSERT INTO personas (nombre, apellido,email,curso,mensaje) VALUES ($1, $2,$3,$4,$5) RETURNING *';
      const values = [nombre, apellido, email, curso, mensaje];
      const res = await this.pool.query(query, values);
      await this.enviarCorreo(email, nombre, curso);
      return res.rows[0];

    } catch (error) {
      throw new InternalServerErrorException("Ha ocurrido un error al insertar dato: " + error.message);
    }
  }

  private async enviarCorreo(email: string, nombre: string, curso: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: '¡Bienvenido(a) a Mazo! - Confirmación de registro',
        html: welcomeEmailTemplate(nombre, curso),
      });
    } catch (error) {
      console.error(`[Error de Correo] No se pudo enviar el correo de bienvenida a ${email}:`, error);
    }
  }

  async findAll() {
    try {
      const query = "SELECT * FROM personas";
      const res = await this.pool.query(query);
      return res.rows;
    } catch (error) {
      throw new InternalServerErrorException("Ha ocurrido un error al obtener los datos: " + error.message);
    }
  }

  async findOne(id: number) {
    try {
      const query = "SELECT * FROM personas WHERE id = $1";
      const res = await this.pool.query(query, [id]);
      if (res.rows.length === 0) throw new NotFoundException("Persona no encontrada");
      return res.rows[0];
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException("Ha ocurrido un error al obtener el dato: " + error.message);
    }
  }

  async remove(id: number) {
    try {
      const query = "DELETE FROM personas WHERE id = $1 RETURNING *";
      const res = await this.pool.query(query, [id]);
      if (res.rows.length === 0) throw new NotFoundException("Persona no encontrada");
      return res.rows[0];
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException("Ha ocurrido un error al eliminar el dato: " + error.message);
    }
  }
}
