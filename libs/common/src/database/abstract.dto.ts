import { IsOptional } from 'class-validator';

export class AbstractDto {
  @IsOptional()
  createdAt: Date;

  @IsOptional()
  updatedAt: Date;

  @IsOptional()
  deleted: boolean;
}
