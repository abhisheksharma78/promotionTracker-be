import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from './guards/public.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { user, token } = await this.authService.login(loginDto);
    return { user, token };
  }

  @UseGuards(JwtAuthGuard)
  @Get('validate')
  async validateToken() {
    // If JwtAuthGuard passes, token is valid
    await Promise.resolve(); // Add await to satisfy async method requirement
    return { valid: true };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Headers('authorization') auth: string) {
    if (!auth) return { success: true };
    const token = auth.split(' ')[1];
    if (token) {
      await this.authService.logout(token);
    }
    return { success: true };
  }
}
