import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  getProfile(email: string) {
    return this.usersRepository.findOne({ email });
  }

  async create(createUserDto: CreateUserDto) {
    this.checkIfUserNameExists(createUserDto.username);
    if (this.checkIfUserNameExists(createUserDto.username)) {
      throw new BadRequestException('Username already exists');
    }
    return this.usersRepository.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    });
  }

  findAll() {
    return this.usersRepository.find({});
  }

  findOne(id: string) {
    return this.usersRepository.findOne({ _id: id });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.usersRepository.findOneAndUpdate(
      { _id: id },
      { $set: updateUserDto },
    );
  }

  remove(id: string) {
    return this.usersRepository.findOneAndDelete({ _id: id });
  }

  checkIfUserNameExists(username: string) {
    const user = this.usersRepository.findOne({ username });
    return !!user;
  }

  getUser(email: string) {
    return this.usersRepository.findOne({ email });
  }
}
