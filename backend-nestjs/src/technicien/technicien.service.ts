import { Injectable } from '@nestjs/common';
import { CreateTechnicienDto } from './dto/create-technicien.dto';
import { UpdateTechnicienDto } from './dto/update-technicien.dto';

@Injectable()
export class TechnicienService {
  create(createTechnicienDto: CreateTechnicienDto) {
    return 'This action adds a new technicien';
  }

  findAll() {
    return `This action returns all technicien`;
  }

  findOne(id: number) {
    return `This action returns a #${id} technicien`;
  }

  update(id: number, updateTechnicienDto: UpdateTechnicienDto) {
    return `This action updates a #${id} technicien`;
  }

  remove(id: number) {
    return `This action removes a #${id} technicien`;
  }
}
