import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UnauthorizedException } from '../../common/exceptions/app.exceptions';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'foody-buddy-jwt-secret-key-2025',
        });
    }

    async validate(payload: any) {
        const user = await this.authService.validateUser(payload.user_id);
        if (!user) {
            throw new UnauthorizedException('Invalid token');
        }
        return user;
    }
}
