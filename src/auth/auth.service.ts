import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { AuthCredentialDto } from './dto/auth-credentials.dto';
import { User, UserDocument } from './schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtService:JwtService
        ) { }

   async signUp(authCredentialDto:AuthCredentialDto):Promise<void>{
        const {username,password} = authCredentialDto;
        const salt = await bcrypt.genSalt();       
       
        const newUser = await  this.userModel.create({
            username,
            password: await bcrypt.hash(password, salt),
            salt
        });
         newUser.save();
    }

  

    async validateUserPassword(authCredentialDto:AuthCredentialDto):Promise<{accessToken:string}>{
        const {username,password} = authCredentialDto;
        const user = await this.userModel.findOne({username});
        console.log(user);

      

        // if (user && await user.validatePassword(password)) {
        if (user) {
            const hash =  await bcrypt.hash(password, user.salt)
            
            if (hash === user.password) {
                
                // return user.username;
                const payload:JwtPayload = {username:user.username}
                const accessToken = await this.jwtService.sign(payload)
                return {accessToken}
            }
        }else{
            // return null;
            throw new UnauthorizedException('Invalid credentials!')
        }
    }
}
