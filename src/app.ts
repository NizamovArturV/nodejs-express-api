import express, { Express } from 'express';
import { Server } from 'http';
import UserController from './users/user.controller.js';
import ILogger from './logger/logger.interface.js';
import { inject, injectable } from 'inversify';
import { TYPES } from './types.js';
import 'reflect-metadata';
import IExceptionFilter from './errors/exception.filter.interface';

@injectable()
export default class App {
	private app: Express;
	private server: Server;
	private port: number;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.UserController) private userController: UserController,
		@inject(TYPES.ExceptionFilter) private exceptionFilter: IExceptionFilter,
	) {
		this.app = express();
		this.port = 8000;
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExceptionsFilters();
		this.server = this.app.listen(this.port);
		this.logger.log('Server Start');
	}

	private useMiddleware(): void {
		this.app.use(express.json());
	}

	private useRoutes(): void {
		this.app.use('/users', this.userController.router);
	}

	private useExceptionsFilters(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}
}
