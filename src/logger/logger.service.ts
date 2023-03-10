import { ILogObj, Logger } from 'tslog';
import ILogger from './logger.interface.js';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export default class LoggerService implements ILogger {
	readonly logger: Logger<ILogObj>;

	constructor() {
		this.logger = new Logger();
	}

	public log(...arg: unknown[]): void {
		this.logger.info(...arg);
	}

	public error(...arg: unknown[]): void {
		this.logger.error(...arg);
	}

	public warn(...arg: unknown[]): void {
		this.logger.warn(...arg);
	}
}
