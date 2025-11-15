import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserRegisterDto, UserLoginDto, UserResponseDto, TokenDto } from '../dto/auth.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    /**
     * Register a new user
     */
    @Post('register')
    async register(@Body() userRegisterDto: UserRegisterDto): Promise<UserResponseDto> {
        return this.authService.registerUser(userRegisterDto);
    }

    /**
     * Login user and return access token
     */
    @Post('login')
    async login(@Body() userLoginDto: UserLoginDto): Promise<TokenDto> {
        return this.authService.authenticateUser(userLoginDto);
    }

    /**
     * Get current user profile (protected route)
     */
    @Get('me')
    @UseGuards(JwtAuthGuard)
    async getProfile(@Request() req): Promise<UserResponseDto> {
        return req.user;
    }
}
