import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';
import {status} from '../../share/entity-status.enum'

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleRepository)
    private readonly _roleReposite: RoleRepository,
  ) {}

  async get(id: number): Promise<Role> {
    if (!id) {
      throw new BadRequestException('id must be find');
    }

    const role = await this._roleReposite.findOne(id, {
      where: { status: status.ACTIVE },
    });

    if (!role) {
      throw new NotFoundException();
    }

    return role;
  }

  async getAll(): Promise<Role[]> {
    const roles = await this._roleReposite.find({
      where: { status: status.ACTIVE },
    });

    return roles;
  }

  async create(role: Role): Promise<Role> {
    const savedRole = await this._roleReposite.save(role);
    return savedRole;
  }

  update(id: number, role: Role): void {
    this._roleReposite.update(id, role);
  }

  delete(id: number): void {
    const roleExist = this._roleReposite.findOne(id, {
      where: { status: status.ACTIVE },
    });
    if (!roleExist) {
      throw new NotFoundException();
    }
    this._roleReposite.update(id, { status: status.INACTIVE });
  }
}
