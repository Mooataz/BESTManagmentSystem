import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(() => {
    service = new AppService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('cleanSpaces', () => {
    it('should remove extra spaces', () => {
      expect(service.cleanSpaces('  hello   world  ')).toBe('hello world');
    });

    it('should handle undefined input', () => {
      expect(service.cleanSpaces(undefined)).toBe('');
    });

    it('should handle empty string', () => {
      expect(service.cleanSpaces('')).toBe('');
    });
  });

  describe('getHello', () => {
    it('should return hello message', () => {
      expect(service.getHello()).toBe('Hello amigo ');
    });
  });
});
