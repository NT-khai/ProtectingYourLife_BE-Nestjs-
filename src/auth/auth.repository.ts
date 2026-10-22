import { Injectable } from '@nestjs/common';
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

  async findUserById(id: number) {
    return await this.prisma.users.findUnique({
      where: {
        id,
      },
      include: {
        user_profiles: true,
      },
    });
  }

  async addUser(newUser: RegisterDto) {
    const createdUser = await this.prisma.users.create({
      data: {
        hovaten: newUser.hovaten,
        email: newUser.email,
        matkhau: newUser.matkhau,
        role: 'user',
        provider: 'credentials',
      },
    });

    // Also initialize user_profiles row
    try {
      await this.prisma.user_profiles.create({
        data: {
          user_id: createdUser.id,
          hovaten: createdUser.hovaten,
        },
      });
    } catch {
      // Ignore if exists
    }

    return createdUser;
  }
}
