import { Module } from '@nestjs/common';
import { PollController } from './poll.controller';
import { PollService } from './poll.service';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, User } from 'src/users/schemas/user.schema';
import { Poll, PollSchema } from './schemas/poll.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      {name: User.name, schema: UserSchema},
      {name: Poll.name, schema: PollSchema}
    ])
  ],
  controllers: [PollController],
  providers: [PollService]
})
export class PollModule {}
