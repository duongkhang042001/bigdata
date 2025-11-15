import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

export enum GenderEnum {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 255 })
    full_name: string;

    @Column({ type: 'varchar', length: 255 })
    hashed_password: string;

    @Column({ type: 'varchar', length: 10, nullable: true })
    gender: string;

    @Column({ type: 'int', nullable: true })
    age: number;

    @Column({ type: 'float', nullable: true })
    height: number; // chiều cao tính bằng cm

    @Column({ type: 'float', nullable: true })
    weight: number; // cân nặng tính bằng kg

    @Column({ type: 'boolean', default: true })
    is_active: boolean;

    @CreateDateColumn({ type: 'timestamp with time zone', nullable: true })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone', nullable: true })
    updated_at: Date;
}
