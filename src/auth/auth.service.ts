import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRepository } from './auth.repository.js';
import { JwtPayloadDto } from './DTO/jwt-payload.dto.js';
import { RegisterDto } from './DTO/authRegister.dto.js';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(taikhoan: JwtPayloadDto): Promise<string> {
    const payload: string = this.jwtService.sign(taikhoan);
    return payload;
  }

  async register(taikhoan: RegisterDto): Promise<string> {
    const findUserByEmail = await this.authRepository.findUserByEmail(
      taikhoan.email,
    );

    if (findUserByEmail) {
      throw new ConflictException('Email đã tồn tại');
    }

    const hashMatKhau = await bcrypt.hash(taikhoan.matkhau, 10);

    const newUser = await this.authRepository.addUser({
      ...taikhoan,
      matkhau: hashMatKhau,
    });

    console.log(newUser);

    return 'Đăng ký thành công';
  }

  async validateUser(email: string, matkhau: string) {
    const user = await this.authRepository.findUserByEmail(email);

    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(matkhau, user.matkhau!);

    if (!isMatch) {
      return null;
    }

    const { matkhau: _, ...result } = user;

    return result;
  }
}
