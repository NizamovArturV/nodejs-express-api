import { NextFunction, Request, Response } from 'express';

export default interface IUserController {
	login: (request: Request, response: Response, nextFunction: NextFunction) => void;

	register: (request: Request, response: Response, nextFunction: NextFunction) => void;
}
