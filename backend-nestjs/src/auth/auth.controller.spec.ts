import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

const mockUser = { id: 1, name: 'Admin', login: 'admin@best.tn', role: ['Administrateur'] };

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockRes = () => {
    const res: any = {};
    res.cookie = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signIn: jest.fn().mockResolvedValue({ user: mockUser, token: { accessToken: 'token', refreshToken: 'refresh' } }),
            logout: jest.fn().mockResolvedValue(undefined),
            findUserById: jest.fn().mockResolvedValue(mockUser),
          },
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('secret') },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /auth/signIn', () => {
    it('should sign in and set cookie', async () => {
      const res = mockRes();
      const result = await controller.sigIn({ login: 'admin@best.tn', password: '123456' }, res);
      expect(res.cookie).toHaveBeenCalledWith('access_token', 'token', expect.any(Object));
      expect(result).toEqual({ user: mockUser });
    });
  });

  describe('GET /auth/logout', () => {
    it('should logout user', async () => {
      const req = { user: { sub: 1, login: 'admin' } } as any;
      await controller.logout(req);
      expect(authService.logout).toHaveBeenCalledWith(1);
    });
  });

  describe('GET /auth/me', () => {
    it('should return current user', async () => {
      const req = { user: { sub: 1, login: 'admin' } } as any;
      const result = await controller.getMe(req);
      expect(result).toEqual(mockUser);
    });
  });
});
