import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const event = this.eventRepository.create(createEventDto);
    return this.eventRepository.save(event);
  }

  async findAll(paginationDto: PaginationDto): Promise<{ data: Event[]; total: number }> {
    const { page = 1, limit = 10 } = paginationDto;
    const [data, total] = await this.eventRepository.findAndCount({
      where: { isActive: true },
      skip: (page - 1) * limit,
      take: limit,
      order: { date: 'ASC' },
    });

    return { data, total };
  }

  async findFeatured(): Promise<Event[]> {
    return this.eventRepository.find({
      where: { isActive: true, isFeatured: true },
      take: 3,
      order: { date: 'ASC' },
    });
  }

  async findUpcoming(): Promise<Event[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.eventRepository.find({
      where: { isActive: true },
      order: { date: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Event> {
    const event = await this.eventRepository.findOne({ 
      where: { id, isActive: true } 
    });
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async update(id: number, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.findOne(id);
    Object.assign(event, updateEventDto);
    return this.eventRepository.save(event);
  }

  async remove(id: number): Promise<void> {
    const event = await this.findOne(id);
    event.isActive = false;
    await this.eventRepository.save(event);
  }

  async search(query: string): Promise<Event[]> {
    return this.eventRepository
      .createQueryBuilder('event')
      .where('event.isActive = :isActive', { isActive: true })
      .andWhere(
        '(event.name LIKE :query OR event.type LIKE :query OR event.location LIKE :query OR event.category LIKE :query)',
        { query: `%${query}%` }
      )
      .orderBy('event.date', 'ASC')
      .getMany();
  }

  async findByCategory(category: string): Promise<Event[]> {
    return this.eventRepository.find({
      where: { category, isActive: true },
      order: { date: 'ASC' },
    });
  }
}
