import { Injectable } from '@nestjs/common';
import { CreateStocKeeperDto } from './dto/create-stoc-keeper.dto';
import { UpdateStocKeeperDto } from './dto/update-stoc-keeper.dto';

@Injectable()
export class StocKeeperService {
  create(createStocKeeperDto: CreateStocKeeperDto) {
    return 'This action adds a new stocKeeper';
  }

  findAll() {
    return `This action returns all stocKeeper`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stocKeeper`;
  }

  update(id: number, updateStocKeeperDto: UpdateStocKeeperDto) {
    return `This action updates a #${id} stocKeeper`;
  }

  remove(id: number) {
    return `This action removes a #${id} stocKeeper`;
  }
}
