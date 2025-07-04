import { ConflictException, Injectable, Post, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import * as bcrypt from "bcryptjs"
import { CreateUser } from 'src/users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginUser } from 'src/users/dto/login-user-dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        private jwtService: JwtService
    ) {}


    async register(data: CreateUser): Promise<{token: string}> {
        console.log("entering inside")
        const { fullName, email, password} = data
        const existingUser = await this.userModel.findOne({email: email}) 
        console.log(existingUser, "existing user")
        if(existingUser){
            throw new ConflictException('Email already exists')
        }
        console.log("password: ",password)

        const hashedPassword = await bcrypt.hash(password, 12)

        const user = await new this.userModel({
            fullName,
            email,
            password: hashedPassword,
            isAdmin: false
        }).save()
        console.log(user, "User")

        const token = this.jwtService.sign({id: user?._id})
        return {token}
    }

    async login(data: LoginUser): Promise<{token: string}> {
        const {email, password} = data
        console.log('entered inside login')

        const validUser = await this.userModel.findOne({email})
        if(!validUser)
            throw new UnauthorizedException("Invalid email")

        const passwordMatch = await bcrypt.compare(password, validUser.password)

        if(!passwordMatch) {
            throw new UnauthorizedException("Wrong password")
        }

        const token = this.jwtService.sign({id: validUser?._id})
        return {token}
        
    }
}
