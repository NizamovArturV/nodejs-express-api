import { IsEmail, IsString } from 'class-validator';

export default class UserLoginDto {
	@IsEmail({}, { message: 'Неверно указан email' })
	email: string;

	@IsString()
	password: string;
}
