import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  UseGuards 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { HomepageService } from './homepage.service';
import { UpdateHomepageContentDto } from './dto/update-homepage-content.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Homepage')
@Controller('homepage')
export class HomepageController {
  constructor(private readonly homepageService: HomepageService) {}

  @Get()
  @ApiOperation({ summary: 'Get all homepage content' })
  @ApiResponse({ status: 200, description: 'Homepage content retrieved successfully' })
  async findAll() {
    return this.homepageService.findAll();
  }

  @Get(':section')
  @ApiOperation({ summary: 'Get homepage content by section' })
  @ApiResponse({ status: 200, description: 'Homepage content retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Homepage content not found' })
  async findBySection(@Param('section') section: string) {
    return this.homepageService.findBySection(section);
  }

  @Post('update')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update homepage content' })
  @ApiResponse({ status: 200, description: 'Homepage content updated successfully' })
  async update(@Body() updateDto: UpdateHomepageContentDto) {
    return this.homepageService.update(updateDto.section, updateDto);
  }

  @Post('initialize')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initialize default homepage content' })
  @ApiResponse({ status: 200, description: 'Default homepage content initialized successfully' })
  async initializeDefaultContent() {
    await this.homepageService.initializeDefaultContent();
    return { message: 'Default homepage content initialized successfully' };
  }
}
