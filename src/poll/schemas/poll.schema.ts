import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PollDocument = Poll & Document;

@Schema({ timestamps: true })
export class Poll {
  @Prop({ required: true })
  title: string;

  @Prop({
    required: true,
    type: [String],
  })
  options: string[];

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'User',
  })
  createdBy: Types.ObjectId;

  @Prop({ default: true })
  isPublic: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  allowedUsers: Types.ObjectId[];

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({
    type: [
      {
        user: { type: Types.ObjectId, ref: 'User' },
        option: String,
        votedAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  votes: Array<{
    user: Types.ObjectId;
    option: string;
    votedAt: Date;
  }>;
}

export const PollSchema = SchemaFactory.createForClass(Poll);
