import { inject, injectable } from 'inversify';
import { PrismaClient, UserModel } from '@prisma/client';
import { TYPES } from '../types';
import ILogger from '../logger/logger.interface';

@injectable()
export default class PrismaService {
	client: PrismaClient;

	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		this.client = new PrismaClient();
	}

	public async connect(): Promise<void> {
		try {
			await this.client.$connect();
			this.logger.log('[PrismaService] db connected');
		} catch (error) {
			if (error instanceof Error) {
				this.logger.error('[PrismaService] db connected error: ' + error.message);
			}
		}
	}

	public async disconnect(): Promise<void> {
		await this.client.$disconnect();
	}
}
