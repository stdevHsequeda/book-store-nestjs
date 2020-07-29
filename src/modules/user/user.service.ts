import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserDetails } from './user.details.entity';
import { getConnection } from 'typeorm';
import { Role } from '../role/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly _userReposite: UserRepository,
  ) {}

  async get(id: number): Promise<User> {
    if (!id) {
      throw new BadRequestException('id must be find');
    }

    const user = await this._userReposite.findOne(id, {
      where: { status: 'ACTIVE' },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async getAll(): Promise<User[]> {
    const users = await this._userReposite.find({
      where: { status: 'ACTIVE' },
    });

    return users;
  }

  async create(user: User): Promise<User> {
    const details = new UserDetails();
    user.details = details;

    const repo = getConnection().getRepository(Role);
    const defaultRole = await repo.findOne({ where: { id: 1 } });
    user.roles = [defaultRole];
    const savedUser = await this._userReposite.save(user);
    return savedUser;
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
