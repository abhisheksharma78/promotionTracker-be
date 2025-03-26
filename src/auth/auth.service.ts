import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';

interface JwtPayload {
  email: string;
  sub: string;
  role: string;
}

interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  token: string;
}

@Injectable()
export class AuthService {
  private readonly invalidatedTokens = new Set<string>();

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    try {
      const user = await this.usersService.validateUser(email, password);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      // Check if the token is invalidated
      const token = this.getTokenFromUser(user);
      if (this.invalidatedTokens.has(token)) {
        throw new UnauthorizedException('Token is invalidated');
      }
      return user;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error validating user credentials',
      );
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    try {
      const user = await this.validateUser(loginDto.email, loginDto.password);
      if (!user.id || !user.email || !user.role) {
        throw new UnauthorizedException('Invalid user data');
      }

      const payload: JwtPayload = {
        email: user.email,
        sub: user.id,
        role: user.role,
      };

      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        token: this.jwtService.sign(payload),
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.error('Login error:', error);
      throw new InternalServerErrorException('Error processing login request');
    }
  }

  async logout(token: string): Promise<void> {
    if (!token) {
      return;
    }

    // Add token to invalidated set
    await Promise.resolve(this.invalidatedTokens.add(token));

    // Schedule cleanup without blocking
    setTimeout(
      () => {
        this.invalidatedTokens.delete(token);
      },
      24 * 60 * 60 * 1000,
    ); // Remove after 24 hours
  }

  private getTokenFromUser(user: User): string {
    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }

  isTokenInvalidated(token: string): boolean {
    return this.invalidatedTokens.has(token);
  }
}
