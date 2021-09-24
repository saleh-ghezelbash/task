import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Model } from "mongoose";
import {Strategy,ExtractJwt} from 'passport-jwt'
import { JwtPayload } from "./jwt-payload.interface";
import { User, UserDocument } from "./schemas/user.schema";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>){
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey:"topsecret"
        })
    }

    async validate(payload:JwtPayload):Promise<User>{
        const {username} = payload;
        const user = await this.userModel.findOne({username});
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}