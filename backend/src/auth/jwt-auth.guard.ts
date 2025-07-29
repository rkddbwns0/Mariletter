import {
  ExecutionContext,
  ForbiddenException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly jwtService: JwtService,

    private readonly authService: AuthService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const access_token = request.headers.authorization?.split(' ')[1];
    const refresh_token = request.headers['refresh-token'];

    if (!access_token || !refresh_token) {
      throw new UnauthorizedException({
        message: 'token이 존재하지 않습니다.',
        status: HttpStatus.UNAUTHORIZED,
      });
    }

    try {
      const payload = this.jwtService.verify(access_token, {
        secret: process.env.JWT_SECRET,
      });
      request['user'] = payload;
    } catch (e) {
      if (e === 'TokenExpiredError' && refresh_token) {
        const payload = this.jwtService.verify(refresh_token, {
          secret: process.env.JWT_SECRET,
        });
        const new_token = await this.authService.refresh(
          payload.user_id,
          refresh_token,
        );
        console.log('새로운 토급 발급');
        request.headers.authorization = `Bearer ${new_token.access_token}`;
        request['refresh-token'] = new_token.refresh_token;
        request['user'] = new_token.user;
        return {
          access_token: new_token.access_token,
          refresh_token: refresh_token,
        };
      } else {
        throw new ForbiddenException({
          message:
            '토큰 인증 과정에서 오류가 발생하였습니다. 다시 로그인해 주세요.',
          status: HttpStatus.FORBIDDEN,
        });
      }
    }
    return true;
  }
}
