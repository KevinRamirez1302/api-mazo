import { Injectable, Inject, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { Pool } from 'pg';

@Injectable()
export class PersonasService {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) { }

  async create(persona: CreatePersonaDto) {
    const { nombre, email, mensaje, enviar_informacion } = persona

    try {
      const query =
        'INSERT INTO personas (nombre, email,mensaje,enviar_informacion) VALUES ($1, $2,$3,$4) RETURNING *';
      const values = [nombre, email, mensaje, enviar_informacion];
      const res = await this.pool.query(query, values);
      return res.rows[0];
    } catch (error) {
      throw new InternalServerErrorException("Ha ocurrido un error al insertar dato: " + error.message);
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
