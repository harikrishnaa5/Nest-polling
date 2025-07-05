import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Poll, PollDocument } from './schemas/poll.schema';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { Model, Types } from 'mongoose';
import { CreatePollDto } from './dto/create-poll.dto';
import { updatePollDto } from './dto/update-poll.dto';

@Injectable()
export class PollService {
  constructor(
    @InjectModel(Poll.name) private pollModel: Model<PollDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}
  async createPoll(
    createPollDto: CreatePollDto,
    userId: Types.ObjectId,
  ): Promise<Poll> {
    const {
      title,
      options,
      isPublic = true,
      allowedUserEmails = [],
      durationInMinutes,
    } = createPollDto;

    const expiresAt = new Date(Date.now() + durationInMinutes * 60 * 1000);
    let allowedUsers: Types.ObjectId[] = [];

    if (!isPublic && allowedUserEmails.length > 0) {
      const users = await this.userModel.find({
        email: { $in: allowedUserEmails },
        isActive: true,
      });
      allowedUsers = users.map((user) => user._id);
    }

    const poll = new this.pollModel({
      title,
      options,
      createdBy: userId,
      isPublic,
      allowedUsers,
      expiresAt,
      isActive: true,
    });

    return poll.save();
  }

  async updatePoll(
    id: string,
    updatePollDto: updatePollDto,
    userId: Types.ObjectId,
  ): Promise<Poll> {
    const poll = await this.pollModel.findById(id);

    if (!poll) {
      throw new NotFoundException('Poll not found');
    }

    if (poll.createdBy !== userId) {
      throw new ForbiddenException('You can only update your own polls');
    }

    const now = new Date();
    if (poll.expiresAt <= now) {
      throw new BadRequestException('Cannot update expired polls');
    }

    const { allowedUserEmails, ...updateData } = updatePollDto;
    let allowedUsers: Types.ObjectId[] = poll.allowedUsers;

    if (allowedUserEmails && allowedUserEmails.length > 0) {
      const users = await this.userModel.find({
        email: { $in: allowedUserEmails },
        isActive: true,
      });
      allowedUsers = users.map((user) => user._id);
    }

    const updatedPoll = await this.pollModel
      .findByIdAndUpdate(
        id,
        { ...updateData, allowedUsers },
        { new: true, runValidators: true },
      )
      .populate('createdBy', 'fullName email');

    if (!updatedPoll) {
      throw new NotFoundException('Poll not found during update');
    }

    return updatedPoll;
  }
}
