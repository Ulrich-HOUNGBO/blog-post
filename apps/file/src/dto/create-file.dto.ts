import { AbstractDto } from '@app/common';

export class CreateFileDto extends AbstractDto {
  label: string;
  path: string;
  size: number;
  type: string;
}
