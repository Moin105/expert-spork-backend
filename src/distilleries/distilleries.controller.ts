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

import { DistilleriesService } from './distilleries.service';
import { CreateDistilleryDto } from './dto/create-distillery.dto';
import { UpdateDistilleryDto } from './dto/update-distillery.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Distilleries')
@Controller('distilleries')
export class DistilleriesController {
  constructor(private readonly distilleriesService: DistilleriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new distillery' })
  @ApiResponse({ status: 201, description: 'Distillery created successfully' })
  async create(@Body() createDistilleryDto: CreateDistilleryDto) {
    return this.distilleriesService.create(createDistilleryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all distilleries with pagination' })
  @ApiResponse({ status: 200, description: 'Distilleries retrieved successfully' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.distilleriesService.findAll(paginationDto);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured distilleries' })
  @ApiResponse({ status: 200, description: 'Featured distilleries retrieved successfully' })
  async findFeatured() {
    return this.distilleriesService.findFeatured();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search distilleries' })
  @ApiResponse({ status: 200, description: 'Search results retrieved successfully' })
  @ApiQuery({ name: 'q', required: true, type: String })
  async search(@Query('q') query: string) {
    return this.distilleriesService.search(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get distillery by ID' })
  @ApiResponse({ status: 200, description: 'Distillery retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Distillery not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.distilleriesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update distillery' })
  @ApiResponse({ status: 200, description: 'Distillery updated successfully' })
  @ApiResponse({ status: 404, description: 'Distillery not found' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateDistilleryDto: UpdateDistilleryDto) {
    return this.distilleriesService.update(id, updateDistilleryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete distillery (soft delete)' })
  @ApiResponse({ status: 200, description: 'Distillery deleted successfully' })
  @ApiResponse({ status: 404, description: 'Distillery not found' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.distilleriesService.remove(id);
    return { message: 'Distillery deleted successfully' };
  }
}
