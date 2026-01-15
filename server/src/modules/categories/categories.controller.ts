import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('分类')
@Controller('categories')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: '创建分类' })
  create(@CurrentUser() user: any, @Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: '获取所有分类' })
  findAll(@CurrentUser() user: any) {
    return this.categoriesService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取分类详情' })
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.categoriesService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新分类' })
  update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除分类' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.categoriesService.remove(id, user.id);
  }
}
