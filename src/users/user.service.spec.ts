import 'reflect-metadata';
import { Container } from 'inversify';
import IConfigService from '../config/config.service.interface';
import IUserRepository from './user.repository.interface';
import IUserService from './user.service.interface';
import { TYPES } from '../types';
import User from './user.entity';
import UserService from './user.service';
import { UserModel } from '@prisma/client';

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};

const UserRepositoryMock: IUserRepository = {
	find: jest.fn(),
	create: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let userRepository: IUserRepository;
let userService: IUserService;

beforeAll(() => {
	container.bind<IUserService>(TYPES.IUserService).to(UserService);
	container.bind<IConfigService>(TYPES.IConfigService).toConstantValue(ConfigServiceMock);
	container.bind<IUserRepository>(TYPES.IUserRepository).toConstantValue(UserRepositoryMock);

	configService = container.get<IConfigService>(TYPES.IConfigService);
	userRepository = container.get<IUserRepository>(TYPES.IUserRepository);
	userService = container.get<IUserService>(TYPES.IUserService);
});

describe('User Service', () => {
	it('createUser', async () => {
		configService.get = jest.fn().mockReturnValueOnce('1');
		userRepository.create = jest.fn().mockImplementationOnce(
			(user: User): UserModel => ({
				name: user.name,
				email: user.email,
				password: user.password,
				id: 1,
			}),
		);
		const createdUser = await userService.createUser({
			email: 'a@a.ru',
			name: 'Test',
			password: '123',
		});

		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.password).not.toEqual('123');
	});
});
