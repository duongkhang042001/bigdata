import { HttpException, HttpStatus } from '@nestjs/common';

export class AppException extends HttpException {
    constructor(message: string, statusCode = HttpStatus.INTERNAL_SERVER_ERROR) {
        super(message, statusCode);
    }
}

export class BadRequestException extends AppException {
    constructor(message: string) {
        super(message, HttpStatus.BAD_REQUEST);
    }
}

export class UnauthorizedException extends AppException {
    constructor(message: string) {
        super(message, HttpStatus.UNAUTHORIZED);
    }
}

export class ConflictException extends AppException {
    constructor(message: string) {
        super(message, HttpStatus.CONFLICT);
    }
}

export class NotFoundException extends AppException {
    constructor(message: string) {
        super(message, HttpStatus.NOT_FOUND);
    }
}
