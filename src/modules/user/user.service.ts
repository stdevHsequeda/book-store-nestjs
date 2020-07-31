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
import {RoleRepository} from '../role/role.repository';
import {status} from '../../share/entity-status.enum'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly _userRepository: UserRepository,
    @InjectRepository(RoleRepository)
    private readonly _roleRepository: RoleRepository,
  ) {}

  async get(id: number): Promise<User> {
    if (!id) {
      throw new BadRequestException('id must be find');
    }

    const user = await this._userRepository.findOne(id, {
      where: { status: status.ACTIVE },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async getAll(): Promise<User[]> {
    const users = await this._userRepository.find({
      where: { status: status.ACTIVE },
    });

    return users;
  }

  async create(user: User): Promise<User> {
    const details = new UserDetails();
    user.details = details;

    const repo = getConnection().getRepository(Role);
    const defaultRole = await repo.findOne({ where: { id: 1 } });
    user.roles = [defaultRole];
    const savedUser = await this._userRepository.save(user);
    return savedUser;
  }

  update(id: number, user: User): void {
    this._userRepository.update(id, user);
  }

  delete(id: number): void {
    const userExist = this._userRepository.findOne(id, {
      where: { status: status.ACTIVE },
    });
    if (!userExist) {
      throw new NotFoundException();
    }
    this._userRepository.update(id, { status: status.INACTIVE });
  }

  async setRoleToUser(userId: number, roleId: number){
    const userExist = await this._userRepository.findOne(userId, {
      where: { status: status.ACTIVE },
    });
    if (!userExist) {
      throw new NotFoundException(`Not found user with id: ${userId}`);
    }

    const roleExist = await this._roleRepository.findOne(roleId, {where:{status: status.ACTIVE}})
    if (!roleExist) {
      throw new NotFoundException(`Not found role with id: ${roleId}`);
    }

    userExist.roles.push(roleExist)
    await this._userRepository.save(userExist)
    return true
  }
}
