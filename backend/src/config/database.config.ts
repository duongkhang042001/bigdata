import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserPreferences } from '../entities/user-preferences.entity';

export const databaseConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || '160.191.88.194',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'admin',
    password: process.env.DB_PASSWORD || 'Abc123',
    database: process.env.DB_NAME || 'foody_buddy',
    entities: [User, UserPreferences],
    synchronize: process.env.NODE_ENV !== 'production', // Don't use in production
    logging: process.env.NODE_ENV === 'development',
};
