import { Body, Controller, Delete, Param, Post, Put, UseGuards } from '@nestjs/common';
import { PollService } from './poll.service';
import { CreatePollDto } from './dto/create-poll.dto';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/auth.decorator';
import { updatePollDto } from './dto/update-poll.dto';
import { UserDocument } from 'src/users/schemas/user.schema';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('poll')
export class PollController {
    constructor(private pollService: PollService) {}

    //create poll - only admin
    @Post('/create')
    @UseGuards(RolesGuard)
    @Roles('admin')
    createPoll(
        @Body() createPoll: CreatePollDto,
        @CurrentUser() user: UserDocument
    ) {
        return this.pollService.createPoll(createPoll, user._id)
    }

    //update poll - only admin
    @Put('/:id')
    @UseGuards(RolesGuard)
    @Roles('admin')
    updatePoll(
        @Param('id') id: string,
        @Body() body: updatePollDto,
        @CurrentUser() user: UserDocument
    ) {
        return this.pollService.updatePoll(id, body, user._id)
    }

    //delete poll - only admin
    // @Delete('/:id')
    // @UseGuards(RolesGuard)
    // @Roles('admin')
    // deletePoll(
    //     @Param('id') id: string
    // ) {
    //     return this.pollService.deletePoll(id)
    // }
}
