import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Distillery } from './entities/distillery.entity';
import { CreateDistilleryDto } from './dto/create-distillery.dto';
import { UpdateDistilleryDto } from './dto/update-distillery.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class DistilleriesService {
  constructor(
    @InjectRepository(Distillery)
    private distilleryRepository: Repository<Distillery>,
  ) {}

  async create(createDistilleryDto: CreateDistilleryDto): Promise<Distillery> {
    const distillery = this.distilleryRepository.create(createDistilleryDto);
    return this.distilleryRepository.save(distillery);
  }

  async findAll(paginationDto: PaginationDto): Promise<{ data: Distillery[]; total: number }> {
    const { page = 1, limit = 10 } = paginationDto;
    const [data, total] = await this.distilleryRepository.findAndCount({
      where: { isActive: true },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { data, total };
  }

  async findFeatured(): Promise<Distillery[]> {
    return this.distilleryRepository.find({
      where: { isActive: true },
      take: 3,
      order: { rating: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Distillery> {
    const distillery = await this.distilleryRepository.findOne({ 
      where: { id, isActive: true } 
    });
    if (!distillery) {
      throw new NotFoundException(`Distillery with ID ${id} not found`);
    }
    return distillery;
  }

  async update(id: number, updateDistilleryDto: UpdateDistilleryDto): Promise<Distillery> {
    const distillery = await this.findOne(id);
    Object.assign(distillery, updateDistilleryDto);
    return this.distilleryRepository.save(distillery);
  }

  async remove(id: number): Promise<void> {
    const distillery = await this.findOne(id);
    distillery.isActive = false;
    await this.distilleryRepository.save(distillery);
  }

  async search(query: string): Promise<Distillery[]> {
    return this.distilleryRepository
      .createQueryBuilder('distillery')
      .where('distillery.isActive = :isActive', { isActive: true })
      .andWhere(
        '(distillery.name LIKE :query OR distillery.type LIKE :query OR distillery.location LIKE :query)',
        { query: `%${query}%` }
      )
      .getMany();
  }
}
