import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: any;

  beforeEach(() => {
    usersService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };
    controller = new UsersController(usersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call usersService.create', async () => {
      const createUserDto = { 
        email: 'test@example.com', 
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      };
      usersService.create.mockResolvedValue({ id: '1', ...createUserDto });
      
      await controller.create(createUserDto);
      
      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should call usersService.findAll', async () => {
      usersService.findAll.mockResolvedValue([]);
      
      await controller.findAll();
      
      expect(usersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call usersService.findOne', async () => {
      usersService.findOne.mockResolvedValue({ id: '1' });
      
      await controller.findOne('1');
      
      expect(usersService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should call usersService.update', async () => {
      const updateUserDto = { 
        email: 'updated@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      };
      usersService.update.mockResolvedValue({ id: '1', ...updateUserDto });
      
      await controller.update('1', updateUserDto);
      
      expect(usersService.update).toHaveBeenCalledWith('1', updateUserDto);
    });
  });

  describe('remove', () => {
    it('should call usersService.remove', async () => {
      usersService.remove.mockResolvedValue(undefined);
      
      await controller.remove('1');
      
      expect(usersService.remove).toHaveBeenCalledWith('1');
    });
  });

  describe('seedUsers', () => {
    it('should create test users', async () => {
      usersService.create.mockResolvedValue({ id: '1', email: 'test@example.com' });
      
      const result = await controller.seedUsers();
      
      expect(result.message).toBe('Test users created successfully');
      expect(usersService.create).toHaveBeenCalled();
    });
  });
}); 