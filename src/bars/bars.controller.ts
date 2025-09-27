import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  UseGuards,
  ParseIntPipe 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

import { BarsService } from './bars.service';
import { CreateBarDto } from './dto/create-bar.dto';
import { UpdateBarDto } from './dto/update-bar.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Bars')
@Controller('bars')
export class BarsController {
  constructor(private readonly barsService: BarsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new bar' })
  @ApiResponse({ status: 201, description: 'Bar created successfully' })
  async create(@Body() createBarDto: CreateBarDto) {
    return this.barsService.create(createBarDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all bars with pagination' })
  @ApiResponse({ status: 200, description: 'Bars retrieved successfully' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.barsService.findAll(paginationDto);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured bars' })
  @ApiResponse({ status: 200, description: 'Featured bars retrieved successfully' })
  async findFeatured() {
    return this.barsService.findFeatured();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search bars' })
  @ApiResponse({ status: 200, description: 'Search results retrieved successfully' })
  @ApiQuery({ name: 'q', required: true, type: String })
  async search(@Query('q') query: string) {
    return this.barsService.search(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get bar by ID' })
  @ApiResponse({ status: 200, description: 'Bar retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Bar not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.barsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update bar' })
  @ApiResponse({ status: 200, description: 'Bar updated successfully' })
  @ApiResponse({ status: 404, description: 'Bar not found' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateBarDto: UpdateBarDto) {
    return this.barsService.update(id, updateBarDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete bar (soft delete)' })
  @ApiResponse({ status: 200, description: 'Bar deleted successfully' })
  @ApiResponse({ status: 404, description: 'Bar not found' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.barsService.remove(id);
    return { message: 'Bar deleted successfully' };
  }
}
