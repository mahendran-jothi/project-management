import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Notification } from 'src/database/entities/notification.entity';
import { Model, Types } from 'mongoose';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectModel(Notification.name)
        private readonly notificationModel: Model<Notification>,
    ) { }

    async create(projectId: string, message: string) {
        return this.notificationModel.create({
            projectId: new Types.ObjectId(projectId),
            message
        });
    }

    async findAll() {
        return this.notificationModel
            .find()
            .select('-__v')
            .populate({ path: 'projectId', select: 'title' })
            .sort({ createdAt: -1 });
    }


}
