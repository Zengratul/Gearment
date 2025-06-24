import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: any;

  beforeEach(() => {
    authService = { login: jest.fn() };
    controller = new AuthController(authService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call authService.login', async () => {
      const loginDto = { email: 'test@example.com', password: 'password123' };
      authService.login.mockResolvedValue({ accessToken: 'token', user: {} });
      
      await controller.login(loginDto);
      
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('logout', () => {
    it('should return logout message', async () => {
      const result = await controller.logout();
      
      expect(result).toEqual({ message: 'Successfully logged out' });
    });
  });
}); 