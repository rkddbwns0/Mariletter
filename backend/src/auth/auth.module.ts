import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt-strategy';
import { TokenEntity } from 'src/entites/token.entits';
import { UsersEntity } from 'src/entites/users.entites';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([UsersEntity, TokenEntity]),
  ],
  providers: [JwtStrategy, AuthService, JwtService],
  exports: [JwtModule],
  controllers: [AuthController],
})
export class AuthModule {}
