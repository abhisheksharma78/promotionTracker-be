import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: JwtPayload) {
    try {
      if (!payload) {
        console.error('No payload in JWT token');
        throw new UnauthorizedException('Invalid token');
      }

      if (!payload.sub || !payload.email || !payload.role) {
        console.error('Missing required fields in JWT payload:', payload);
        throw new UnauthorizedException('Invalid token payload');
      }

      return {
        id: payload.sub,
        email: payload.email,
        role: payload.role
      };
    } catch (error) {
      console.error('JWT validation error:', error);
      throw new UnauthorizedException('Token validation failed');
    }
  }
}
