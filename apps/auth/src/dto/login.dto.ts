import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    type: String,
    example: `example@email.com`,
  })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
