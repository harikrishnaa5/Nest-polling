import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PollModule } from './poll/poll.module';

@Module({
  imports: [
    UsersModule, 
    AuthModule,
    ConfigModule.forRoot(
      {isGlobal: true}
    ),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async(configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      })
    }),
    PollModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
