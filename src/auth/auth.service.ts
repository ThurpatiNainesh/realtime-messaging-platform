import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async validateUser(email: string, password: string) {
    try {
      const user = await this.usersService.findByEmail(email);
      if (!user || !user.passwordHash) {
        console.log('User not found or missing password hash');
        return null;
      }

      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        console.log('Invalid password');
        return null;
      }

      return user;
    } catch (error) {
      console.error('Error in validateUser:', error);
      throw error;
    }
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
  async register(email: string, password: string) {
  const existing = await this.usersService.findByEmail(email);
  if (existing) {
    throw new ConflictException('Email already registered');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await this.usersService.createUser({
    email,
    passwordHash,
  });

  return {
    id: user.id,
    email: user.email,
  };
}

}
