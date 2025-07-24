import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUser } from 'src/dto/users.dto';
import { UsersEntity } from 'src/entites/users.entites';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { TokenEntity } from 'src/entites/token.entits';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly users: Repository<UsersEntity>,

    @InjectRepository(TokenEntity)
    private readonly token: Repository<TokenEntity>,

    private readonly jwtService: JwtService,
  ) {}

  async createUsers(createUser: CreateUser): Promise<any> {
    try {
      const user = await this.users.findOne({
        where: { email: createUser.email },
      });
      console.log(user);
      if (user) {
        throw new HttpException(
          '이미 가입된 사용자입니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
      const hashPassword = this.hashPassword(createUser.password);
      const newUser = this.users.create({
        ...createUser,
        password: hashPassword,
      });
      await this.users.save(newUser);
      return { message: '회원가입이 완료되었습니다.', user: newUser };
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
    }
  }

  private hashPassword(password: string) {
    try {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      return hash;
    } catch (e) {
      throw new Error(e);
    }
  }

  async dupEmail(email: string) {
    const regexp = new RegExp(
      '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
    );

    if (!regexp.test(email)) {
      throw new HttpException(
        '이메일 형식에 맞지 않습니다.',
        HttpStatus.CONFLICT,
      );
    }

    const user = await this.users.findOne({ where: { email } });
    console.log(user);
    if (user) {
      throw new HttpException('이미 가입된 이메일입니다.', HttpStatus.CONFLICT);
    }

    return { avalidate: true };
  }

  async login(loginDto: LoginDto) {
    const user = await this.users.findOne({
      where: { email: loginDto.email },
    });

    if (!user || !bcrypt.compareSync(loginDto.password, user.password)) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 일치하지 않습니다.',
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
  }

  async refresh(user_id: number, refresh_token: string) {
    const user = await this.users.findOne({ where: { id: user_id } });
    const token = await this.token.findOne({
      where: { user_id: user_id, token: refresh_token },
    });

    if (!user || refresh_token !== token?.token) {
      throw new ForbiddenException({
        message: '유효하지 않은 토큰입니다.',
        status: HttpStatus.FORBIDDEN,
      });
    }

    try {
      this.jwtService.verify(refresh_token);
      const payload = { user_id: user.id, email: user.email, name: user.name };
      const new_access_token = this.jwtService.sign(payload, {
        expiresIn: '15m',
      });
      return { access_token: new_access_token };
    } catch {
      throw new BadRequestException({
        message: '토큰 갱신에 실패했습니다.',
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }
}
