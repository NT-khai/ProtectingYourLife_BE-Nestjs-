import { Module } from '@nestjs/common';
import { AuthControler } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthRepository } from './auth.repository.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { LocalStrategy } from './strategy/localStrategy.strategy.js';
import { JwtStrategy } from './strategy/jwtStrategy.strategy.js';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.COOKIE_ACCESS,
      signOptions: {
        expiresIn: '1h',
      },
    }),
    PassportModule,
    PrismaModule,
  ],
  controllers: [AuthControler],
  providers: [AuthService, AuthRepository, LocalStrategy, JwtStrategy],
  exports: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
