import { NextFunction, Request, Response } from 'express';

export default interface IMiddleware {
	execute: (req: Request, response: Response, next: NextFunction) => void;
}
