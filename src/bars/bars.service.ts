import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Bar } from './entities/bar.entity';
import { CreateBarDto } from './dto/create-bar.dto';
import { UpdateBarDto } from './dto/update-bar.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class BarsService {
  constructor(
    @InjectRepository(Bar)
    private barRepository: Repository<Bar>,
  ) {}

  async create(createBarDto: CreateBarDto): Promise<Bar> {
    const bar = this.barRepository.create(createBarDto);
    return this.barRepository.save(bar);
  }

  async findAll(paginationDto: PaginationDto): Promise<{ data: Bar[]; total: number }> {
    const { page = 1, limit = 10 } = paginationDto;
    const [data, total] = await this.barRepository.findAndCount({
      where: { isActive: true },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { data, total };
  }

  async findFeatured(): Promise<Bar[]> {
    return this.barRepository.find({
      where: { isActive: true },
      take: 3,
      order: { rating: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Bar> {
    const bar = await this.barRepository.findOne({ where: { id, isActive: true } });
    if (!bar) {
      throw new NotFoundException(`Bar with ID ${id} not found`);
    }
    return bar;
  }

  async update(id: number, updateBarDto: UpdateBarDto): Promise<Bar> {
    const bar = await this.findOne(id);
    Object.assign(bar, updateBarDto);
    return this.barRepository.save(bar);
  }

  async remove(id: number): Promise<void> {
    const bar = await this.findOne(id);
    bar.isActive = false;
    await this.barRepository.save(bar);
  }

  async search(query: string): Promise<Bar[]> {
    return this.barRepository
      .createQueryBuilder('bar')
      .where('bar.isActive = :isActive', { isActive: true })
      .andWhere(
        '(bar.name LIKE :query OR bar.type LIKE :query OR bar.location LIKE :query)',
        { query: `%${query}%` }
      )
      .getMany();
  }
}
