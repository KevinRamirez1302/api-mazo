import { Injectable, Inject, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {

  constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) { }

  async create(usuario: CreateUsuarioDto) {
    try {
      const { username, password, profile_img } = usuario;

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const query = "INSERT INTO usuarios (username, password, profile_img) VALUES ($1, $2, $3) RETURNING id, username, profile_img";
      const res = await this.pool.query(query, [username, passwordHash, profile_img]);

      console.log("Usuario creado exitosamente");
      return res.rows[0];
    } catch (error) {
      throw new InternalServerErrorException("Ha ocurrido un error al crear el usuario: " + error.message);
    }
  }

  async login(usuario: CreateUsuarioDto) {
    const { username, password } = usuario;
    try {
      const query = "SELECT * FROM usuarios WHERE username = $1";
      const res = await this.pool.query(query, [username]);

      if (res.rows.length === 0) {
        throw new UnauthorizedException("Credenciales invalidas");
      }

      const user = res.rows[0];
      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        throw new UnauthorizedException("Credenciales invalidas");
      }

      const { password: userPassword, ...userData } = user;
      return userData;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException("Ha ocurrido un error al iniciar sesión");
    }
  }
  findAll() {
    return `This action returns all usuarios`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usuario`;
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }
}
