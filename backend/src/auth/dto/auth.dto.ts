import {
    IsEmail,
    IsString,
    IsOptional,
    IsEnum,
    IsInt,
    IsNumber,
    Min,
    Max,
    MinLength,
} from 'class-validator';

export enum GenderEnum {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other',
}

export class UserLoginDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}

export class UserRegisterDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    password: string;

    @IsString()
    full_name: string;

    @IsOptional()
    @IsEnum(GenderEnum)
    gender?: GenderEnum;

    @IsOptional()
    @IsInt()
    @Min(1, { message: 'Age must be between 1 and 150' })
    @Max(150, { message: 'Age must be between 1 and 150' })
    age?: number;

    @IsOptional()
    @IsNumber()
    @Min(50, { message: 'Height must be between 50 and 300 cm' })
    @Max(300, { message: 'Height must be between 50 and 300 cm' })
    height?: number;

    @IsOptional()
    @IsNumber()
    @Min(10, { message: 'Weight must be between 10 and 500 kg' })
    @Max(500, { message: 'Weight must be between 10 and 500 kg' })
    weight?: number;
}

export class UserResponseDto {
    id: number;
    email: string;
    full_name: string;
    gender?: string;
    age?: number;
    height?: number;
    weight?: number;
    is_active: boolean;
}

export class TokenDto {
    access_token: string;
    token_type: string = 'bearer';
}

export class TokenDataDto {
    email?: string;
}
