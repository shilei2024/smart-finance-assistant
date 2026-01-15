import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.category.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, userId: string) {
    const category = await this.prisma.category.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });

    if (!category) {
      throw new NotFoundException('分类不存在');
    }

    return category;
  }

  async update(id: string, userId: string, dto: UpdateCategoryDto) {
    await this.findOne(id, userId);

    return this.prisma.category.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    return this.prisma.category.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
