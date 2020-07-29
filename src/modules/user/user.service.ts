import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { MapperService } from 'src/share/mapped.service';
import { UserDto } from './dto/user.dto';
import { User } from './user.entity';
import { UserDetails } from './user.details.entity';
import { getConnection } from 'typeorm';
import { Role } from '../role/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly _userReposite: UserRepository,
    private readonly _mapperService: MapperService,
  ) {}

  async get(id: number): Promise<UserDto> {
    if (!id) {
      throw new BadRequestException('id must be find');
    }

    const user = await this._userReposite.findOne(id, {
      where: { status: 'ACTIVE' },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return this._mapperService.map<User, UserDto>(user, new UserDto());
  }

  async getAll(): Promise<UserDto[]> {
    const users = await this._userReposite.find({
      where: { status: 'ACTIVE' },
    });

    return users.map(user =>
      this._mapperService.map<User, UserDto>(user, new UserDto()),
    );
  }

  async create(user: User): Promise<UserDto> {
    const details = new UserDetails();
    user.details = details;

    const repo = getConnection().getRepository(Role);
    const defaultRole = await repo.findOne({ where: { id: 1 } });
    user.roles = [defaultRole];
    const savedUser = await this._userReposite.save(user);
    return this._mapperService.map<User, UserDto>(savedUser, new UserDto());
  }

  update(id: number, user: User): void {
    this._userReposite.update(id, user);
  }

  delete(id: number): void {
    const userExist = this._userReposite.findOne(id, {
      where: { status: 'ACTIVE' },
    });
    if (!userExist) {
      throw new NotFoundException();
    }
    this._userReposite.update(id, { status: 'INACTIVE' });
  }
}
