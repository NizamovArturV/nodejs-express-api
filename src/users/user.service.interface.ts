import UserRegisterDto from './dto/user-register.dto.js';
import User from './user.entity.js';
import UserLoginDto from './dto/user-login.dto.js';
import { UserModel } from '@prisma/client';

export default interface IUserService {
	createUser: (dto: UserRegisterDto) => Promise<UserModel | null>;
	validateUser: (dto: UserLoginDto) => Promise<boolean>;
}
