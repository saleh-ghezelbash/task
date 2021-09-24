import { createParamDecorator } from "@nestjs/common";
import { User } from "./schemas/user.schema";

export const GetUser = createParamDecorator((data,req): User => {
    // console.log('user2',req.args[0].user);
    return req.args[0].user;
    // return req.user;
})