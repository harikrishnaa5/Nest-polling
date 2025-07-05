import { ArrayMinSize, IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";


export class updatePollDto {

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsArray()
    @ArrayMinSize(2)
    @IsNotEmpty({each: true})
    options: string[]

    @IsBoolean()
    @IsOptional()
    isPublic?: boolean = true

    @IsOptional()
    @IsArray()
    @IsString({each: true})
    allowedUserEmails?: string[]
}