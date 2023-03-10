import IMiddleware from './middleware.interface.js';
import { NextFunction, Request, Response } from 'express';

export class AuthGuard implements IMiddleware {
	execute(request: Request, response: Response, next: NextFunction): void {
		if (request.user) {
			return next();
		}

		response.status(401).send({ error: 'Unauthorized' });
	}
}