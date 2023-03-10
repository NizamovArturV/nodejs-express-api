import { NextFunction, Request, Response, Router } from 'express';
import IMiddleware from "./middleware.interface.js";

export default interface IControllerRoute {
	path: string;
	function: (req: Request, response: Response, next: NextFunction) => void;
	method: keyof Pick<Router, 'get' | 'post' | 'delete' | 'patch' | 'put'>;
	middlewares?: IMiddleware[];
}
