import { TransactionType } from './transaction';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon?: string;
  color?: string;
  parentId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryDto {
  name: string;
  type: TransactionType;
  icon?: string;
  color?: string;
  parentId?: string;
  isActive?: boolean;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}
