import IMiddleware from './middleware.interface.js';
import { NextFunction, Request, Response } from 'express';
import jsonWebToken from 'jsonwebtoken';
const { verify } = jsonWebToken;
export default class AuthMiddleware implements IMiddleware {
	constructor(private secret: string) {}
	execute(request: Request, response: Response, next: NextFunction): void {
		if (request.headers.authorization) {
			verify(request.headers.authorization.split(' ')[1], this.secret, (error, payload) => {
				if (error) {
					next();
				} else if (payload && typeof payload !== 'string') {
					request.user = payload.email;
					next();
				}
			});
		} else {
			next();
		}
	}
}
