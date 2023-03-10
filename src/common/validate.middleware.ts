import IMiddleware from './middleware.interface';
import { NextFunction, Request, Response } from 'express';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export default class ValidateMiddleware implements IMiddleware {
	constructor(private classToValidate: ClassConstructor<object>) {}

	execute({ body }: Request, response: Response, next: NextFunction): void {
		const instance = plainToInstance(this.classToValidate, body);

		validate(instance).then((errors) => {
			if (errors.length > 0) {
				response.status(422).send(errors);
			} else {
				next();
			}
		});
	}
}
