import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { LoginDto, RegisterDto } from './dto/auth.dto';

const BCRYPT_ROUNDS = 12;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.users.exists({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Ya existe una cuenta con ese email');

    const { password, ...data } = dto;
    const user = await this.users.save(
      this.users.create({ ...data, passwordHash: await bcrypt.hash(password, BCRYPT_ROUNDS) }),
    );
    return this.buildSession(user);
  }

  async login({ email, password }: LoginDto) {
    const user = await this.users.findOne({
      where: { email },
      select: ['id', 'name', 'email', 'address', 'phone', 'role', 'createdAt', 'updatedAt', 'passwordHash'],
    });
    // Mismo mensaje para email o contraseña incorrectos: evita enumerar usuarios.
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Email o contraseña incorrectos');
    }
    const { passwordHash: _, ...safeUser } = user;
    return this.buildSession(safeUser as User);
  }

  private buildSession(user: User) {
    const token = this.jwt.sign({ sub: user.id, email: user.email, role: user.role });
    const { passwordHash: _, ...safeUser } = user;
    return { user: safeUser, token };
  }
}
