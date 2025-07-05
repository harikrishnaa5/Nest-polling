import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {
    const secret = configService.get<string>('JWT_SECRET');
if (!secret) throw new Error('JWT_SECRET is not defined in .env');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:secret,
    });
  }

  async validate(payload: { id: string }) {
    const user = await this.userModel.findById(payload.id).select('-password');
    if (!user) {
      throw new UnauthorizedException('User not found or inactive');
    }
    return user;
  }
}
