import { NestFactory } from '@nestjs/core';
import { Model } from 'mongoose';
import { User } from 'src/database/entities/user.entity';
import { getModelToken } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { AppModule } from 'src/app.module';

async function seed() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const userModel = app.get<Model<User>>(getModelToken(User.name));
    const users = [
        { username: 'Ram', password: 'ram@solutionchamps', role: 'Admin' },
        { username: 'Santhosh', password: 'santhosh@solutionchamps', role: 'Viewer' },
        { username: 'Arun', password: 'arun@solutionchamps', role: 'Viewer' },
    ];

    for (const user of users) {
        const existing = await userModel.findOne({ username: user.username });
        if (!existing) {
            const hashed = await bcrypt.hash(user.password, 10);
            await userModel.create({ username: user.username, password: hashed, role: user.role });
            console.log(`Seeded: ${user.username}/${user.password}`);
        } else {
            console.log(`Skipped: ${user.username} already exists.`);
        }
    }
    await app.close();
}

seed();
