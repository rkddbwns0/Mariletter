import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from 'src/dto/auth.dto';
import { TokenEntity } from 'src/entites/token.entits';
import { UsersEntity } from 'src/entites/users.entites';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly users: Repository<UsersEntity>,

    @InjectRepository(TokenEntity)
    private readonly token: Repository<TokenEntity>,

    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    try {
      const user = await this.users.findOne({
        where: { email: loginDto.email },
      });

      if (!user || !bcrypt.compareSync(loginDto.password, user.password)) {
        throw new HttpException(
          '이메일 또는 비밀번호가 일치하지 않습니다.',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const payload = { user_id: user.id, email: user.email, name: user.name };
      const access_token = this.jwtService.sign(payload, {
        expiresIn: '15m',
        secret: process.env.JWT_SECRET,
      });
      const refresh_token = this.jwtService.sign(payload, {
        expiresIn: '7d',
        secret: process.env.JWT_SECRET,
      });

      const token = this.token.create({
        user_id: user.id,
        token: refresh_token,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      });

      await this.token.save(token);
      await this.users.update(user.id, { last_login: new Date() });

      return {
        access_token,
        refresh_token,
      };
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      console.error(e);
      throw new HttpException(
        '로그인 과정에 문제가 발생했습니다. 다시 시도해 주세요.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async logout(user_id: number) {
    try {
      const token = await this.token.findOne({ where: { user_id } });
      if (token) {
        await this.token.remove(token);
      }
      return true;
    } catch (e) {
      console.error(e);
      throw new HttpException(
        '로그아웃 과정에 문제가 발생했습니다. 다시 시도해 주세요.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async refresh(user_id: number, refresh_token: string) {
    try {
      const user = await this.users.findOne({ where: { id: user_id } });
      const token = await this.token.findOne({
        where: { user_id: user_id, token: refresh_token },
      });

      if (!user || refresh_token !== token?.token) {
        throw new HttpException(
          '유효하지 않은 토큰입니다.',
          HttpStatus.FORBIDDEN,
        );
      }

      this.jwtService.verify(refresh_token);
      const payload = { user_id: user.id, email: user.email, name: user.name };
      const new_access_token = this.jwtService.sign(payload, {
        expiresIn: '15m',
      });
      const new_refresh_token = this.jwtService.sign(payload, {
        expiresIn: '7d',
      });

      await this.token.update(payload.user_id, {
        token: new_refresh_token,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      });

      return {
        user: payload,
        access_token: new_access_token,
        refresh_token: new_refresh_token,
      };
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      console.error(e);
      throw new HttpException(
        '토큰 갱신에 문제가 발생했습니다. 다시 시도해 주세요.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
