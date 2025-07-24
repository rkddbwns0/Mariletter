import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/entites/users.entites';
import { UserService } from './uesrs.service';
import { UsersController } from './users.controller';
import { TokenEntity } from 'src/entites/token.entits';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity, TokenEntity])],
  controllers: [UsersController],
  providers: [UserService, JwtService],
  exports: [],
})
export class UsersModule {}
