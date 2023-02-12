import { Injectable, Post, Body } from '@nestjs/common';
import { UsersModuleService } from 'src/users-module/users-module.service';
import { RegisterDTO } from './dtos/register.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthModuleService {
  constructor(
    private userService: UsersModuleService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  public async register(registrationData: RegisterDTO) {
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
    const userData = {
      email: registrationData.email,
    };
    return this.userService.create(userData, hashedPassword);
  }

  public async validateUser(email: string, password: string) {
    const user = await this.userService.getByEmail(email);
    if (
      user &&
      (await bcrypt.compare(password, user.password.hashedPassword))
    ) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  public async createSession(user: any) {
    const payload = { email: user.email, sub: user.id };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('jwt.secret'),
      expiresIn: this.configService.get('expiresIn'),
    });

    return {
      access_token: accessToken,
    };
  }
}