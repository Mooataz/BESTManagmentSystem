import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from 'express';
type JwtPayload = { sub: number,
                    login: string
                    }

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt'){
    constructor(){
        super({
           // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
           
            jwtFromRequest: ExtractJwt.fromExtractors([
            (req: Request) => {
                return req?.cookies?.['access_token']; // lecture du cookie
            },
            ]),
           secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET!
        })
    }

    validate(payload: JwtPayload){
        return payload
    }
}