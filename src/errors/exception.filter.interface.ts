import { NextFunction, Request, Response } from 'express';

export default interface IExceptionFilter {
	catch: (error: Error, request: Request, response: Response, nextFunction: NextFunction) => void;
}
