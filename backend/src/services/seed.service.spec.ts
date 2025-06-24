import { SeedService } from './seed.service';

describe('SeedService', () => {
  let service: SeedService;
  let usersRepository: any;
  let leaveBalanceRepository: any;

  beforeEach(() => {
    usersRepository = { find: jest.fn(), create: jest.fn(), save: jest.fn() };
    leaveBalanceRepository = { find: jest.fn(), create: jest.fn(), save: jest.fn() };
    service = new SeedService(usersRepository as any, leaveBalanceRepository as any);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
}); 