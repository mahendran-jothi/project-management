import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/database/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) { }

  async validateUser(username: string, pass: string, role: string): Promise<any> {
    const user = await this.userModel.findOne({ username: username, role: role });

    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(payload: { username: string; password: string; role: string }) {
    const user = await this.validateUser(payload.username, payload.password, payload.role);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const jwtPayload = {
      username: user.username,
      role: user.role,
      sub: user._id.toString(),
    };

    return { access_token: this.jwtService.sign(jwtPayload), username: user.username, role: user.role };
  }
}
