import { Get, Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
    @Get() 
    findAll() {
        return "This is findAll"
    }
}
