import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    ManyToOne,
    JoinColumn,
    Unique,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_preferences')
@Index(['userId'])
@Index(['version'])
@Index(['isCompleted'])
@Unique('UQ_user_preferences_user_version', ['userId', 'version'])
export class UserPreferences {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'user_id', type: 'int' })
    userId: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'jsonb', nullable: true })
    answers: Record<string, any>;

    @Column({ type: 'varchar', length: 50, default: '1.0', nullable: true })
    version: string;

    @Column({ name: 'is_completed', type: 'boolean', default: false, nullable: true })
    isCompleted: boolean;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp with time zone',
        nullable: true
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp with time zone',
        nullable: true
    })
    updatedAt: Date;

    @Column({
        name: 'completed_at',
        type: 'timestamp with time zone',
        nullable: true
    })
    completedAt: Date | null;
}
