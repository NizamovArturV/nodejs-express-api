import App from './app.js';
import LoggerService from './logger/logger.service.js';
import UserController from './users/user.controller.js';
import ExceptionFilter from './errors/exception.filter.js';
import { Container, ContainerModule, interfaces } from 'inversify';
import ILogger from './logger/logger.interface.js';
import { TYPES } from './types.js';
import IExceptionFilter from './errors/exception.filter.interface.js';
import UserService from './users/user.service.js';
import IUserService from './users/user.service.interface.js';
import IUserController from './users/user.controller.interface.js';
import IConfigService from './config/config.service.interface.js';
import ConfigService from './config/config.service.js';
import PrismaService from './database/prisma.service.js';

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
