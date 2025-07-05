import { ArrayMinSize, IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { Type } from 'class-transformer';


export class CreatePollDto {

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

    @IsNumber()
    @Min(5)
    @Max(120)
    @Type(() => Number)
    durationInMinutes: number
}