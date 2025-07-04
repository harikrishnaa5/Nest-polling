import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument, SchemaTypes, Types } from "mongoose"

export type UserDocument = HydratedDocument<User>

@Schema({ timestamps: true })
export class User {

    @Prop({type: SchemaTypes.ObjectId, auto: true})
    _id: Types.ObjectId;

    @Prop({required: true})
    fullName: string;

    @Prop({
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    })
    email: string;

    @Prop({
        required: true,
        minlength: 8,
    })
    password: string;

    @Prop()
    isAdmin: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);