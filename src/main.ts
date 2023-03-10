import App from './app';
import LoggerService from './logger/logger.service';
import UserController from './users/user.controller';
import ExceptionFilter from './errors/exception.filter';
import { Container, ContainerModule, interfaces } from 'inversify';
import ILogger from './logger/logger.interface';
import { TYPES } from './types';
import IExceptionFilter from './errors/exception.filter.interface';
import UserService from './users/user.service';
import IUserService from './users/user.service.interface';
import IUserController from './users/user.controller.interface';
import IConfigService from './config/config.service.interface';
import ConfigService from './config/config.service';
import PrismaService from './database/prisma.service';
import IUserRepository from './users/user.repository.interface';
import UserRepository from './users/user.repository';

export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
	bind<IUserController>(TYPES.UserController).to(UserController);
	bind<IUserService>(TYPES.IUserService).to(UserService);
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
	bind<IConfigService>(TYPES.IConfigService).to(ConfigService).inSingletonScope();
	bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository).inSingletonScope();
	bind<App>(TYPES.Application).to(App);
});

function bootstrap(): IBootstrapReturn {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	app.init();
	return { appContainer, app };
}

export const { app, appContainer } = bootstrap();
