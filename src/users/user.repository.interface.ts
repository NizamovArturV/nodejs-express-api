import User from './user.entity.js';
import { UserModel } from '@prisma/client';

export default interface IUserRepository {
	create: (user: User) => Promise<UserModel>;
	find: (email: string) => Promise<UserModel | null>;
}
