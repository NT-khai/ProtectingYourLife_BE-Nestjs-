import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegisterDto } from './DTO/authRegister.dto.js';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUserByEmail(email: string) {
    return await this.prisma.users.findUnique({
      where: {
        email,
      },
    });
  }

  async addUser(newUser: RegisterDto) {
    return await this.prisma.users.create({
      data: {
        hovaten: newUser.hovaten,
        email: newUser.email,
        matkhau: newUser.matkhau,
      },
    });
  }
}
