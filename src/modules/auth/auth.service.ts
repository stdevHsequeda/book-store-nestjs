import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import {AuthRepository} from './auth.repository';
import {InjectRepository} from '@nestjs/typeorm';
import {JwtService} from '@nestjs/jwt';
import {SignupDto, SigninDto} from './dto';
import {compare} from 'bcryptjs';
import {User} from '../user/user.entity';
import {IJwtPayload} from './jwt-payload.interface';
import {RoleType} from '../role/roletype.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthRepository)
    private readonly _authRepository: AuthRepository,
    private readonly _jwtService: JwtService,
  ){}

  async signup(signupDto: SignupDto): Promise<void>{
    const {username, email} = signupDto;
    const userExists = await this._authRepository.findOne({
      where: [{username},{email}]
    })

    if (userExists) {
      throw new ConflictException('username or email already exists')
    }

    return this._authRepository.signup(signupDto)
  }

  async signin(signinDto: SigninDto): Promise<{ token: string }>{
    const {username, password} = signinDto;

    const user: User = await this._authRepository.findOne({
      where:{username}
    })

    const isMatch = await compare(password, user.password)

    if (!isMatch) {
      throw new UnauthorizedException('invalid credentials')
    }

    const payload: IJwtPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
      roles: user.roles.map(r => r.name as RoleType)
    }

    const token =  this._jwtService.sign(payload)

    return {token}
  }
}