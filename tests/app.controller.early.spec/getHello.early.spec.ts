// Unit tests for: getHello

import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../../src/app.controller';
import { AppService } from '../../src/app.service';

describe('AppController.getHello() getHello method', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getHello: jest.fn().mockReturnValue('Hello World!'),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('Happy Paths', () => {
    it('should return "Hello World!" when getHello is called', () => {
      // Test to ensure the getHello method returns the expected string
      const result = appController.getHello();
      expect(result).toBe('Hello World!');
    });

    it('should call appService.getHello once', () => {
      // Test to ensure appService.getHello is called exactly once
      appController.getHello();
      expect(appService.getHello).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle unexpected return values gracefully', () => {
      // Test to handle unexpected return values from appService.getHello
      jest
        .spyOn(appService, 'getHello')
        .mockReturnValueOnce('Unexpected Value');
      const result = appController.getHello();
      expect(result).toBe('Unexpected Value');
    });

    it('should handle appService.getHello throwing an error', () => {
      // Test to ensure the controller handles errors thrown by appService.getHello
      jest.spyOn(appService, 'getHello').mockImplementationOnce(() => {
        throw new Error('Service Error');
      });

      expect(() => appController.getHello()).toThrow('Service Error');
    });
  });
});

// End of unit tests for: getHello
