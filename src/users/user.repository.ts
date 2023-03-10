import IUserRepository from './user.repository.interface.js';
import User from './user.entity.js';
import { UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import PrismaService from '../database/prisma.service.js';
import { TYPES } from '../types.js';

@injectable()
export default class UserRepository implements IUserRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}
	async create({ email, password, name }: User): Promise<UserModel> {
		return this.prismaService.client.userModel.create({
			data: {
				email,
				password,
				name,
			},
		});
	}

	async find(email: string): Promise<UserModel | null> {
		return this.prismaService.client.userModel.findFirst({
			where: {
				email,
			},
		});
	}
}
