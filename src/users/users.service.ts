import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserData: Partial<User>): Promise<User> {
    if (createUserData.password) {
      const salt = await bcrypt.genSalt();
      createUserData.password = await bcrypt.hash(createUserData.password, salt);
    }
    const user = this.usersRepository.create(createUserData);
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async update(id: string, updateUserData: Partial<User>): Promise<User> {
    if (updateUserData.password) {
      const salt = await bcrypt.genSalt();
      updateUserData.password = await bcrypt.hash(updateUserData.password, salt);
    }
    await this.usersRepository.update(id, updateUserData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.findByEmail(email);
      if (!user) {
        console.log(`User with email ${email} not found`);
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        console.log(`Invalid password for user ${email}`);
        return null;
      }

      return user;
    } catch (error) {
      console.error('Error validating user:', error);
      return null;
    }
  }
}
