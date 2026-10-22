import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty({
    message: 'Họ và tên không được để trống',
  })
  @MaxLength(100)
  hovaten: string;

  @IsEmail(
    {},
    {
      message: 'Email không hợp lệ',
    },
  )
  email: string;

  @IsString()
  @MinLength(6, {
    message: 'Mật khẩu phải có ít nhất 6 ký tự',
  })
  matkhau: string;
}
