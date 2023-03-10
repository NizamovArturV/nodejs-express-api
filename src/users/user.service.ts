import IUserService from './user.service.interface.js';
import UserRegisterDto from './dto/user-register.dto.js';
import UserLoginDto from './dto/user-login.dto.js';
import User from './user.entity.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types.js';
import IConfigService from '../config/config.service.interface.js';
import IUserRepository from './user.repository.interface.js';
import { UserModel } from '@prisma/client';

@injectable()
export default class UserService implements IUserService {
	constructor(
		@inject(TYPES.IConfigService) private configService: IConfigService,
		@inject(TYPES.IUserRepository) private userRepository: IUserRepository,
	) {}

	async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
		const newUser = new User(email, name);
		const salt = Number(this.configService.get('SALT'));
		await newUser.setPassword(password, salt);

		const existedUser = await this.userRepository.find(email);

		if (existedUser) {
			return null;
		}

		return this.userRepository.create(newUser);
	}

	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		const existedUser = await this.userRepository.find(email);
		if (!existedUser) {
			return false;
		}
		const newUser = new User(existedUser.email, existedUser.name, existedUser.password);

		return newUser.comparePassword(password);
	}
}
