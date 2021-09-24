import { Body, Controller, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/auth-credentials.dto';
import { GetUser } from './get-user.decorator';
import { User } from './schemas/user.schema';

@Controller('auth')
export class AuthController {
    constructor(private AuthService: AuthService) { }

    @Post('/signup')
    signUp(@Body(ValidationPipe) authCredentialDto: AuthCredentialDto): Promise<void> {

        return this.AuthService.signUp(authCredentialDto)

    }

    @Post('/signin')
    signIn(@Body(ValidationPipe) authCredentialDto: AuthCredentialDto):Promise<{accessToken:string}> {

        return this.AuthService.validateUserPassword(authCredentialDto)

    }

    @Post('/test')
    @UseGuards(AuthGuard())
    test(@GetUser() user:User){
        console.log('usertest',user);
        
    }
}
