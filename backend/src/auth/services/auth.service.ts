import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { PasswordService } from './password.service';
import { TokenService } from './token.service';
import { UserRegisterDto, UserLoginDto, UserResponseDto, TokenDto } from '../dto/auth.dto';
import {
    BadRequestException,
    UnauthorizedException,
    ConflictException,
} from '../../common/exceptions/app.exceptions';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordService: PasswordService,
        private readonly tokenService: TokenService,
    ) { }

    /**
     * Register a new user
     */
    async registerUser(userDataDto: UserRegisterDto): Promise<UserResponseDto> {
        // Check if email already exists
        if (await this.userRepository.emailExists(userDataDto.email)) {
            throw new ConflictException('Email already registered');
        }

        // Check password strength
        const passwordCheck = this.passwordService.isStrongPassword(userDataDto.password);
        if (!passwordCheck.isValid) {
            throw new BadRequestException(`Password is weak: ${passwordCheck.errorMessage}`);
        }

        // Hash password
        const hashedPassword = await this.passwordService.hashPassword(userDataDto.password);

        // Create new user
        const newUser = await this.userRepository.create({
            email: userDataDto.email,
            full_name: userDataDto.full_name,
            hashed_password: hashedPassword,
            gender: userDataDto.gender,
            age: userDataDto.age,
            height: userDataDto.height,
            weight: userDataDto.weight,
        });

        return {
            id: newUser.id,
            email: newUser.email,
            full_name: newUser.full_name,
            gender: newUser.gender,
            age: newUser.age,
            height: newUser.height,
            weight: newUser.weight,
            is_active: newUser.is_active,
        };
    }

    /**
     * Authenticate user and return token
     */
    async authenticateUser(userDataDto: UserLoginDto): Promise<TokenDto> {
        // Find user by email
        const user = await this.userRepository.findByEmail(userDataDto.email);
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        // Verify password
        const isPasswordValid = await this.passwordService.verifyPassword(
            userDataDto.password,
            user.hashed_password,
        );
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        // Check if user is active
        if (!user.is_active) {
            throw new UnauthorizedException('Account is disabled');
        }

        // Create access token
        const accessToken = this.tokenService.createAccessToken(user.id.toString());

        return {
            access_token: accessToken,
            token_type: 'bearer',
        };
    }

    /**
     * Get user by ID
     */
    async getUserById(userId: string): Promise<UserResponseDto> {
        const user = await this.userRepository.findById(parseInt(userId));
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            gender: user.gender,
            age: user.age,
            height: user.height,
            weight: user.weight,
            is_active: user.is_active,
        };
    }

    /**
     * Validate user by ID (for JWT strategy)
     */
    async validateUser(userId: string): Promise<UserResponseDto | null> {
        try {
            return await this.getUserById(userId);
        } catch {
            return null;
        }
    }
}
