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
import jsonWebToken from 'jsonwebtoken';
import IConfigService from '../config/config.service.interface.js';
import { AuthGuard } from '../common/auth.guard.js';
const { sign } = jsonWebToken;
@injectable()
export default class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) logger: ILogger,
		@inject(TYPES.IUserService) private userService: IUserService,
		@inject(TYPES.IConfigService) private configService: IConfigService,
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
			{
				path: '/info',
				method: 'get',
				function: this.info,
				middlewares: [new AuthGuard()],
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

		const jwt = await this.signJWT(request.body.email, this.configService.get('SECRET'));

		this.ok(response, { jwt });
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

	public async info(
		{ user }: Request,
		response: Response,
		nextFunction: NextFunction,
	): Promise<void> {
		const userInfo = await this.userService.getUserInfo(user);

		this.ok(response, { email: userInfo?.email, id: userInfo?.id });
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign(
				{
					email,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{
					algorithm: 'HS256',
				},
				(error, token) => {
					if (error) {
						reject(error);
					}

					resolve(token as string);
				},
			);
		});
	}
}
