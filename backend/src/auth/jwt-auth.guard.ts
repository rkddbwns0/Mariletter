import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const access_token = request.headers.authorization?.split(' ')[1];
    const refresh_token = request.headers['refresh-token'];

    console.log(request);

    if (!access_token) {
      throw new UnauthorizedException('access_token이 존재하지 않습니다.');
    }

    try {
      const payload = this.jwtService.verify(access_token, {
        secret: process.env.JWT_SECRET,
      });
      request['user'] = payload;
    } catch (e) {
      throw new UnauthorizedException('유효하지 않은 access_token입니다.');
    }
    return true;
  }
}
