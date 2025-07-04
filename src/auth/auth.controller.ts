import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUser } from 'src/users/dto/create-user.dto';
import { LoginUser } from 'src/users/dto/login-user-dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    @Post('/signup')
    register(@Body() request: CreateUser) {
        return this.authService.register(request)
    }

    @Post('/login')
    login(@Body() request: LoginUser) {
        return this.authService.login(request)
    }
}
