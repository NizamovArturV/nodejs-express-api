import express, { Express } from 'express';
import { Server } from 'http';
import UserController from './users/user.controller';
import ILogger from './logger/logger.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';
import 'reflect-metadata';
import IExceptionFilter from './errors/exception.filter.interface';
import PrismaService from './database/prisma.service';
import AuthMiddleware from './common/auth.middleware';
import IConfigService from './config/config.service.interface';

@injectable()
export default class App {
	private app: Express;
	private server: Server;
	private port: number;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.UserController) private userController: UserController,
		@inject(TYPES.ExceptionFilter) private exceptionFilter: IExceptionFilter,
		@inject(TYPES.IConfigService) private configService: IConfigService,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
	) {
		this.app = express();
		this.port = 8000;
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExceptionsFilters();
		await this.prismaService.connect();
		this.server = this.app.listen(this.port);
		this.logger.log('Server Start');
	}

	private useMiddleware(): void {
		this.app.use(express.json());
		const authMiddleware = new AuthMiddleware(this.configService.get('SECRET'));
		this.app.use(authMiddleware.execute.bind(authMiddleware));
	}

	private useRoutes(): void {
		this.app.use('/users', this.userController.router);
	}

	private useExceptionsFilters(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}
}
