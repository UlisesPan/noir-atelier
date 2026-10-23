import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 12;
}

export interface Paginated<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export const paginate = <T>(data: T[], total: number, { page, limit }: PaginationDto): Paginated<T> => ({
  data,
  meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
});
