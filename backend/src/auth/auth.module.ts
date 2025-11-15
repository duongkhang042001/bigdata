import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../entities/user.entity';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { PasswordService } from './services/password.service';
import { TokenService } from './services/token.service';
import { UserRepository } from './repositories/user.repository';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'foody-buddy-jwt-secret-key-2025',
            signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '60m' },
        }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        PasswordService,
        TokenService,
        UserRepository,
        JwtStrategy,
    ],
    exports: [AuthService, UserRepository],
})
export class AuthModule { }
