import { Body, Controller, Get, Injectable, Module, NotFoundException, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, PartialType, PickType } from '@nestjs/swagger';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrentUser, JwtUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RegisterDto } from '../auth/dto/auth.dto';
import { User } from './user.entity';

export class UpdateProfileDto extends PartialType(PickType(RegisterDto, ['name', 'address', 'phone'] as const)) {}

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly users: Repository<User>) {}

  async findById(id: number) {
    const user = await this.users.findOneBy({ id });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async update(id: number, dto: UpdateProfileDto) {
    const user = await this.findById(id);
    return this.users.save(this.users.merge(user, dto));
  }
}

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users/me')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  me(@CurrentUser() user: JwtUser) {
    return this.users.findById(user.id);
  }

  @Patch()
  update(@CurrentUser() user: JwtUser, @Body() dto: UpdateProfileDto) {
    return this.users.update(user.id, dto);
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
