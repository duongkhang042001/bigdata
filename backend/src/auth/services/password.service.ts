import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class PasswordService {
    /**
     * Hash a password using bcrypt.
     */
    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(12);
        return bcrypt.hash(password, salt);
    }

    /**
     * Verify if a password matches its hash.
     */
    async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }

    /**
     * Check if a password meets strength requirements.
     */
    isStrongPassword(password: string): { isValid: boolean; errorMessage?: string } {
        if (password.length < 8) {
            return { isValid: false, errorMessage: 'Password must be at least 8 characters long' };
        }

        if (!/[a-z]/.test(password)) {
            return { isValid: false, errorMessage: 'Password must include at least one lowercase letter' };
        }

        if (!/[A-Z]/.test(password)) {
            return { isValid: false, errorMessage: 'Password must include at least one uppercase letter' };
        }

        if (!/[0-9]/.test(password)) {
            return { isValid: false, errorMessage: 'Password must include at least one number' };
        }

        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            return { isValid: false, errorMessage: 'Password must include at least one special character' };
        }

        return { isValid: true };
    }
}
