import { Transform } from 'class-transformer';
import { IsEmail, IsString, Length, Matches, MaxLength } from 'class-validator';

const normalizeEmail = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim().toLowerCase() : value;

export class LoginDto {
  @Transform(normalizeEmail)
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @IsString()
  @MaxLength(72)
  password: string;
}

export class RegisterDto extends LoginDto {
  @IsString()
  @Length(2, 80)
  name: string;

  @IsString()
  @Length(8, 72)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'La contraseña debe tener mayúscula, minúscula y número',
  })
  declare password: string;

  @IsString()
  @Length(5, 160)
  address: string;

  @IsString()
  @Matches(/^\+?[\d\s-]{8,20}$/, { message: 'Teléfono inválido' })
  phone: string;
}
