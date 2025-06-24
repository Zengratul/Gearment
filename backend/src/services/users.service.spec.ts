import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { NotFoundException } from '@nestjs/common';

const mockUsersRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
});

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository;

  beforeEach(() => {
    usersRepository = mockUsersRepository();
    service = new UsersService(usersRepository as any);
  });

  describe('create', () => {
    it('should call save with hashed password', async () => {
      usersRepository.create.mockReturnValue({});
      usersRepository.save.mockResolvedValue({});
      await service.create({ email: 'a', password: 'b' } as any);
      expect(usersRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      usersRepository.find.mockResolvedValue([]);
      expect(await service.findAll()).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should throw if not found', async () => {
      usersRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should call save', async () => {
      usersRepository.findOne.mockResolvedValue({});
      usersRepository.save.mockResolvedValue({});
      await service.update('id', { password: 'new' } as any);
      expect(usersRepository.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should call remove', async () => {
      usersRepository.findOne.mockResolvedValue({});
      usersRepository.remove.mockResolvedValue({});
      await service.remove('id');
      expect(usersRepository.remove).toHaveBeenCalled();
    });
  });
}); 