import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReferenceDto } from './dto/create-reference.dto';
import { UpdateReferenceDto } from './dto/update-reference.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reference } from './entities/reference.entity';
import { In, Repository } from 'typeorm';
import { Model } from 'src/models/entities/model.entity';
import { AllPart } from 'src/all-parts/entities/all-part.entity';
import { AppService } from 'src/app.service';

@Injectable()
export class ReferencesService {
  constructor(@InjectRepository(Reference) private readonly referenceRepositry: Repository<Reference>,
              @InjectRepository(Model) private readonly modelRepositry: Repository<Model>,
              @InjectRepository(AllPart) private readonly allPartRepositry: Repository<AllPart>,
              private appService: AppService 

) { }

async create(createReferenceDto: CreateReferenceDto): Promise<Reference> {
  createReferenceDto.materialCode =
    this.appService.cleanSpaces(createReferenceDto.materialCode);
  createReferenceDto.description =
    this.appService.cleanSpaces(createReferenceDto.description);

  if (!createReferenceDto.modelIds || createReferenceDto.modelIds.length === 0) {
    throw new NotFoundException('No model ids provided');
  }

  const model = await this.modelRepositry.find({
    where: {
      id: In(createReferenceDto.modelIds),
    },
  });

  if (!model.length) {
    throw new NotFoundException('No model');
  }

  const allpart = await this.allPartRepositry.findOne({
    where: { id: createReferenceDto.allpart },
  });

  if (!allpart) {
    throw new NotFoundException('No part');
  }

  const createNew = this.referenceRepositry.create({
    ...createReferenceDto,
    model,
    allpart,
  });

  return await this.referenceRepositry.save(createNew);
}

  async findAll(): Promise<Reference[]> {
    const findAll = await this.referenceRepositry.find({  relations: ['allpart','model']})
    if (!findAll || findAll.length === 0) {
      throw new NotFoundException('No Reference found')
    }
    return findAll;
  }

  async findOne(id: number): Promise<Reference> {
    const findOne = await this.referenceRepositry.findOne({ where: { id }, relations: ['allpart','model'] })
    if (!findOne) {
      throw new NotFoundException('No Reference available')
    }
    return findOne;
  }

  async update(id: number, updateReferenceDto: UpdateReferenceDto): Promise<Reference> {
    const { allpart, modelIds, ...rest} = updateReferenceDto;

    let updateData: Partial<Reference> = { ...rest };

    // Vérifier si allpart est fourni et récupérer l'entité correspondante
    if (updateReferenceDto.allpart !== undefined) {
        const allpart = await this.allPartRepositry.findOne({ where: { id: updateReferenceDto.allpart } });
        if (!allpart) {
            throw new NotFoundException('No part found');
        }
        updateData.allpart = allpart; // Conversion de number -> AllPart
    }

    await this.referenceRepositry.update(id, updateData);

    const updatedReference = await this.referenceRepositry.findOne({ where: { id }, relations: ['allpart'] });

    if (!updatedReference) {
        throw new NotFoundException('Reference not found to update');
    }

    return updatedReference;
}

async remove(id: number):Promise<Reference> {
  const deletedata = await this.referenceRepositry.findOne ({where: {id}});
  if (!deletedata) {
    throw new NotFoundException('Reference not found for delete')
  }
  await this.referenceRepositry.delete({ id: deletedata.id })
  return deletedata;   }

  async findCompatibleReferences(modelId: number, partId: number): Promise<Reference[]> {
    const references = await this.referenceRepositry
      .createQueryBuilder('reference')
      .leftJoinAndSelect('reference.model', 'model')
      .leftJoinAndSelect('reference.allpart', 'allpart')
      .where('allpart.id = :partId', { partId })
      .andWhere('model.id = :modelId', { modelId })
      .getMany();
      if (!references.length) {
        throw new NotFoundException('Reference not found')
      }
    return references;
  }

 

async findReferenceByMaterialCode(materialCode: string): Promise<Reference> {
  const reference = await this.referenceRepositry.findOne({
    where: { materialCode },
    relations: ['stockPart', 'model', 'allpart'], // Inclure les relations si nécessaire
  });

  if (!reference) {
    throw new NotFoundException(`Reference with materialCode ${materialCode} not found`);
  }

  return reference;
}
}
