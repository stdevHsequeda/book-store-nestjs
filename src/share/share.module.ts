import { Module } from '@nestjs/common';
import { MapperService } from './mapped.service';

@Module({
  providers: [MapperService],
  exports: [MapperService],
})
export class SharedModule {}
