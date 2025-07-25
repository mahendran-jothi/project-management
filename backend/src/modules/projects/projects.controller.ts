import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    UseGuards,
    Req,
    UsePipes,
    ValidationPipe,
    UnprocessableEntityException,
    Query,
} from '@nestjs/common';

import { ProjectsService } from './projects.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/constants/roles.enum';
import { AuthRequest } from 'src/common/interfaces/auth-request.interface';
import { IsNotEmpty, IsString } from 'class-validator';
class ProjectDto {
    @IsString({ message: 'Title must be a string' })
    @IsNotEmpty({ message: 'Title is a required field' })
    title: string;

    @IsString({ message: 'Description must be a string' })
    @IsNotEmpty({ message: 'Description is a required field' })
    description: string;
}

@Controller('projects')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ProjectsController {
    constructor(private svc: ProjectsService) { }

    @Get()
    @Roles(Role.Admin, Role.Viewer)
    async all(@Query('search') search?: string) {
        const projects = await this.svc.findAll(search);
        return {
            statusCode: 200,
            message: 'Project data fetched successfully',
            data: projects,
        };
    }

    @Get(':id')
    @Roles(Role.Admin, Role.Viewer)
    async one(@Param('id') id: string) {
        const project = await this.svc.findOne(id);
        return {
            statusCode: 200,
            message: 'Project data fetched successfully',
            data: project,
        };
    }

    @Post()
    @Roles(Role.Admin)
    @UsePipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        exceptionFactory: (errors) => {
            const firstError = errors[0];
            const message = firstError?.constraints && Object.values(firstError.constraints)[0];

            return new UnprocessableEntityException({
                statusCode: 422,
                error: 'Unprocessable Entity',
                message: message || 'Validation failed',
            });
        }
    }))
    async create(@Body() dto: ProjectDto, @Req() req: AuthRequest) {
        const userId = req.user.userId;
        const project = await this.svc.create(dto, userId); // ✅ Add 'await' here

        return {
            statusCode: 201,
            message: 'Project created successfully',
            data: project
        };
    }


    @Put(':id')
    @Roles(Role.Admin)
    @UsePipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        exceptionFactory: (errors) => {
            const firstError = errors[0];
            const message = firstError?.constraints && Object.values(firstError.constraints)[0];

            return new UnprocessableEntityException({
                statusCode: 422,
                error: 'Unprocessable Entity',
                message: message || 'Validation failed',
            });
        }
    }))
    async update(@Param('id') id: string, @Body() dto: ProjectDto, @Req() req: AuthRequest) {
        const userId = req.user.userId;
        const project = await this.svc.update(id, dto, userId);
        return {
            statusCode: 200,
            message: 'Project updated successfully',
            data: project
        };
    }

    @Delete(':id')
    @Roles(Role.Admin)
    async delete(@Param('id') id: string) {
        const project = await this.svc.delete(id);
        return {
            statusCode: 200,
            message: 'Project deleted successfully',
            data: {},
        };
    }
}
