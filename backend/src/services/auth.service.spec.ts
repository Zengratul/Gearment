import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';

const mockUsersRepository = () => ({
  findOne: jest.fn(),
});

describe('AuthService', () => {
  let service: AuthService;
  let usersRepository;

  beforeEach(() => {
    usersRepository = mockUsersRepository();
    service = new AuthService(usersRepository as any);
  });

  describe('login', () => {
    it('should throw if user not found', async () => {
      usersRepository.findOne.mockResolvedValue(null);
      await expect(service.login({ email: 'test', password: '123' })).rejects.toThrow(UnauthorizedException);
    });
    // Thêm test cho các trường hợp khác nếu cần
  });

  describe('validateUser', () => {
    it('should throw if user not found', async () => {
      usersRepository.findOne.mockResolvedValue(null);
      await expect(service.validateUser('id')).rejects.toThrow(UnauthorizedException);
    });
    // Thêm test cho các trường hợp khác nếu cần
  });
}); 