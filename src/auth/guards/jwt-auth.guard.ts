import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from './public.decorator';
import { AuthService } from '../auth.service';
import { Request } from 'express';

interface RequestWithAuth extends Request {
  headers: {
    authorization?: string;
  };
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // Get the token from the request
    const request = context.switchToHttp().getRequest<RequestWithAuth>();
    const token = request.headers.authorization?.split(' ')[1];

    // Check if token is invalidated
    if (token && this.authService.isTokenInvalidated(token)) {
      throw new UnauthorizedException('Token is invalidated');
    }

    return super.canActivate(context);
  }
}
