import IUserService from "./user.service.interface.js";
import UserRegisterDto from "./dto/user-register.dto.js";
import UserLoginDto from "./dto/user-login.dto.js";
import User from "./user.entity.js";
import {injectable} from "inversify";

@injectable()
export default class UserService implements IUserService{
    async createUser({email, name, password}: UserRegisterDto): Promise<User | null> {
        const newUser = new User(email, name);

        await newUser.setPassword(password);

        //Проверка что он есть?
        //Если есть, возвращаем null
        //Если нет, то создаем
        return newUser;
    }

    async validateUser({}: UserLoginDto):  Promise<boolean> {
        return true;
    }
}