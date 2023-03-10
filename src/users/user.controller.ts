import BaseController from '../common/base.controller.js';
import { NextFunction, Request, Response } from 'express';
import ILogger from '../logger/logger.interface.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types.js';
import 'reflect-metadata';
import IUserController from './user.controller.interface.js';
import UserLoginDto from './dto/user-login.dto.js';
import UserRegisterDto from './dto/user-register.dto.js';
import IUserService from './user.service.interface.js';
import HttpError from '../errors/http-error.class.js';
import ValidateMiddleware from '../common/validate.middleware.js';

@injectable()
export default class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) logger: ILogger,
		@inject(TYPES.IUserService) private userService: IUserService,
	) {
		super(logger);
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				function: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: '/login',
				method: 'post',
				function: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
		]);
	}

	public async login(
		request: Request<{}, {}, UserLoginDto>,
		response: Response,
		nextFunction: NextFunction,
	): Promise<void> {
		const result = await this.userService.validateUser(request.body);

		if (!result) {
			return nextFunction(new HttpError(401, 'Login error', 'login'));
		}

		this.ok(response, {});
	}

	public async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		response: Response,
		nextFunction: NextFunction,
	): Promise<void> {
		const result = await this.userService.createUser(body);

		if (!result) {
			return nextFunction(new HttpError(422, 'User already exist'));
		}

		this.ok(response, { email: result.email, id: result.id });
	}
}
