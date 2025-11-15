import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
    constructor(private readonly jwtService: JwtService) { }

    /**
     * Create an access token for a user
     */
    createAccessToken(userId: string, additionalData?: Record<string, any>): string {
        const payload = { user_id: userId, type: 'access', ...additionalData };
        return this.jwtService.sign(payload);
    }

    /**
     * Create a refresh token for a user
     */
    createRefreshToken(userId: string): string {
        const payload = { user_id: userId, type: 'refresh' };
        return this.jwtService.sign(payload, { expiresIn: '7d' });
    }

    /**
     * Verify and decode JWT token
     */
    verifyToken(token: string): any {
        try {
            return this.jwtService.verify(token);
        } catch (error) {
            return null;
        }
    }

    /**
     * Decode token without verification (for debugging)
     */
    decodeToken(token: string): any {
        return this.jwtService.decode(token);
    }
}
