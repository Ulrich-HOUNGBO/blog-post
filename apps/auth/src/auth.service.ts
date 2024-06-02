import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { LoginUserDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from './users/models/user.schema';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './users/dto/create-user.dto';
import { UsersService } from './users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    private userService: UsersService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userService.getUser(email);
    console.log(user);
    if (!user) {
      this.logger.warn(`Entity not found with {"email":"${email}"}`);
      throw new NotFoundException('Any user found with these credentials');
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user);
    return { user, token };
  }

  private generateToken(user: UserDocument) {
    const payload = { email: user.email, id: user._id };
    return jwt.sign(payload, this.configService.getOrThrow('JWT_SECRET'), {
      expiresIn: this.configService.get('JWT_EXPIRATION'),
    });
  }
}
