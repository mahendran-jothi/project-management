import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException, UnprocessableEntityException, ConflictException, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from 'src/database/entities/project.entity';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { Types } from 'mongoose';
import { generateSlug } from 'src/common/utils/slug.util';

@Injectable()
export class ProjectsService {
    constructor(
        @InjectModel(Project.name) private projectModel: Model<Project>,
        private notifyGateway: NotificationsGateway
    ) { }

    async create(dto: { title: string; description: string }, userId: string) {
        try {
            const slug = generateSlug(dto.title);

            const exists = await this.projectModel.findOne({ slug });
            if (exists) {
                throw new ConflictException('This project already exists.');
            }

            const doc = new this.projectModel({
                ...dto,
                slug,
                createdBy: new Types.ObjectId(userId),
            });

            const projectSave = await doc.save();

            this.notifyGateway.notifyViewers('project:created', {
                message: `Project ${projectSave.title} was created.`,
                projectId: projectSave._id,
            });

            const project = await this.projectModel
                .findById(doc._id)
                .select('-__v')
                .populate({ path: 'createdBy', select: 'username' })
                .populate({ path: 'updatedBy', select: 'username' })
                .exec();

            return project;

        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Failed to create a project');
        }
    }

    async findAll(search?: string) {
        const filter: any = {};

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
            ];
        }

        return this.projectModel.find(filter)
            .select('-__v')
            .populate({ path: 'createdBy', select: 'username' })
            .populate({ path: 'updatedBy', select: 'username' })
            .sort({ createdAt: -1 })
            .exec();
    }

    async findOne(id: string) {
        const project = await this.projectModel.findById(id)
            .select('-__v')
            .populate({
                path: 'createdBy',
                select: 'username',
            })
            .populate({
                path: 'updatedBy',
                select: 'username',
            })
            .exec();
        if (!project) throw new NotFoundException('Project not found');
        return project;
    }

    async update(id: string, dto: any, userId: string) {
        try {
            const slug = generateSlug(dto.title);

            const exists = await this.projectModel.findOne({
                slug,
                _id: { $ne: id },
            });
            if (exists) {
                throw new ConflictException('This project already exists.');
            }

            const p = await this.projectModel.findByIdAndUpdate(
                id,
                { ...dto, slug, updatedBy: new Types.ObjectId(userId) },
                { new: true }
            ).exec();
            if (!p) throw new NotFoundException('Project not found');

            this.notifyGateway.notifyViewers('project:updated', {
                message: `Project ${p.title} was updated.`,
                projectId: p._id,
            });

            const project = await this.projectModel.findById(id)
                .select('-__v')
                .populate({ path: 'createdBy', select: 'username' })
                .populate({ path: 'updatedBy', select: 'username' })
                .exec();


            return project;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Failed to update a project');
        }
    }

    async delete(id: string) {
        try {
            const p = await this.projectModel.findByIdAndDelete(id).exec();
            if (!p) throw new NotFoundException('Project not found');
            this.notifyGateway.notifyViewers('project:deleted', {
                message: `Project ${p.title} was deleted.`,
                projectId: p._id,
            });
            return { deleted: true };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Failed to delete a project');
        }
    }
}
