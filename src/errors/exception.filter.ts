import { NextFunction, Request, Response } from 'express';
import IExceptionFilter from './exception.filter.interface';
import HttpError from './http-error.class';
import ILogger from '../logger/logger.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import 'reflect-metadata';

@injectable()
export default class ExceptionFilter implements IExceptionFilter {
	constructor(@inject(TYPES.ILogger) private logger: ILogger) {}

	catch(
		error: Error | HttpError,
		request: Request,
		response: Response,
		nextFunction: NextFunction,
	): void {
		if (error instanceof HttpError) {
			this.logger.error(`[${error.context}] Ошибка ${error.statusCode}: ${error.message}`);
			response.status(error.statusCode).send({ error: error.message });
		} else {
			this.logger.error(`${error.message}`);
			response.status(500).send({ error: error.message });
		}
	}
}
