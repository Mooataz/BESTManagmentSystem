import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

jest.mock('argon2', () => ({ verify: jest.fn().mockResolvedValue(true), hash: jest.fn().mockResolvedValue('hashed-refresh') }));

const mockUser = { id: 1, login: 'admin@best.tn', password: 'hashedPass123', name: 'Admin', role: ['Administrateur'], status: 'Autoriser', branch: { id: 1, name: 'Branch 1' } };

describe('AuthService', () => {
  let service: AuthService;
  let userService: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: { findOne: jest.fn().mockResolvedValue(mockUser) },
        },
        {
          provide: UsersService,
          useValue: {
            findUserByLogin: jest.fn().mockResolvedValue(mockUser),
            findOne: jest.fn().mockResolvedValue(mockUser),
            update: jest.fn().mockResolvedValue(mockUser),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('mock-token'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('mock-secret'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signIn', () => {
    it('should sign in with valid credentials', async () => {
      const result = await service.signIn({ login: 'admin@best.tn', password: '123456' });
      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
    });

    it('should throw if user not found', async () => {
      jest.spyOn(userService, 'findUserByLogin').mockResolvedValue(null);
      await expect(service.signIn({ login: 'x@x.tn', password: '123' })).rejects.toThrow(BadRequestException);
    });

    it('should throw if account disabled', async () => {
      jest.spyOn(userService, 'findUserByLogin').mockResolvedValue({ ...mockUser, status: 'Bloquer' });
      await expect(service.signIn({ login: 'admin@best.tn', password: '123' })).rejects.toThrow(UnauthorizedException);
    });

    it('should throw if wrong password', async () => {
      const argon2 = require('argon2');
      argon2.verify.mockResolvedValue(false);
      await expect(service.signIn({ login: 'admin@best.tn', password: 'wrong' })).rejects.toThrow(BadRequestException);
    });
  });

  describe('findUserById', () => {
    it('should return user by id', async () => {
      const result = await service.findUserById(1);
      expect(result).toEqual(mockUser);
    });
  });

  describe('logout', () => {
    it('should clear refresh token', async () => {
      await service.logout(1);
      expect(userService.update).toHaveBeenCalledWith(1, { refreshToken: null });
    });
  });
});
