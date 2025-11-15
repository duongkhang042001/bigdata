import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    /**
     * Create a new user
     */
    async create(userData: {
        email: string;
        full_name: string;
        hashed_password: string;
        gender?: string;
        age?: number;
        height?: number;
        weight?: number;
    }): Promise<User> {
        const user = this.userRepository.create(userData);
        return this.userRepository.save(user);
    }

    /**
     * Find user by email
     */
    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { email } });
    }

    /**
     * Find user by ID
     */
    async findById(id: number): Promise<User | null> {
        return this.userRepository.findOne({ where: { id } });
    }

    /**
     * Check if email exists
     */
    async emailExists(email: string): Promise<boolean> {
        const user = await this.userRepository.findOne({ where: { email } });
        return !!user;
    }

    /**
     * Update user
     */
    async update(id: number, userData: Partial<User>): Promise<User | null> {
        await this.userRepository.update(id, userData);
        return this.findById(id);
    }

    /**
     * Delete user
     */
    async delete(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }

    /**
     * Find all users (with pagination)
     */
    async findAll(skip = 0, take = 10): Promise<[User[], number]> {
        return this.userRepository.findAndCount({
            skip,
            take,
            order: { created_at: 'DESC' },
        });
    }
}
