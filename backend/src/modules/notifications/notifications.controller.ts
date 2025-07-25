import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/constants/roles.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('notifications')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Get()
    @Roles(Role.Viewer)
    async getByProject() {
        const notifs = await this.notificationsService.findAll();
        return {
            statusCode: 200,
            message: 'Notifications fetched successfully',
            data: notifs,
        };
    }
}
