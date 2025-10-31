import { Test, TestingModule } from '@nestjs/testing';
import { SubmitFormController } from './submit-form.controller';
import { SubmitFormUseCase } from '../application/submit-form.usecase';
import { SubmitFormDto } from './dtos/submit-form.dto';
import { FormSubmissionEntity } from '../domain/form.entity';
import { InternalServerErrorException } from '@nestjs/common';

describe('SubmitFormController', () => {
  let controller: SubmitFormController;
  let useCase: jest.Mocked<SubmitFormUseCase>;

  const mockUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubmitFormController],
      providers: [
        {
          provide: SubmitFormUseCase,
          useValue: mockUseCase,
        },
      ],
    }).compile();

    controller = module.get<SubmitFormController>(SubmitFormController);
    useCase = module.get(SubmitFormUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should submit form and return response with id and createdAt', async () => {
      const inputDto: SubmitFormDto = {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        message: 'Hello world',
      };

      const mockEntity: FormSubmissionEntity = {
        id: 123,
        name: inputDto.name,
        email: inputDto.email,
        message: inputDto.message,
        createdAt: new Date('2025-06-15T10:30:00Z'),
      };

      mockUseCase.execute.mockResolvedValueOnce(mockEntity);

      const result = await controller.execute(inputDto);

      expect(useCase.execute).toHaveBeenCalledWith(inputDto);
      expect(result.data).toEqual({
        id: mockEntity.id,
        createdAt: mockEntity.createdAt,
      });
      expect(result.timestamp).toBeInstanceOf(Date);
    });

    it('should throw InternalServerErrorException if use case fails', async () => {
      const inputDto: SubmitFormDto = {
        name: 'Bob Smith',
        email: 'bob@example.com',
        message: 'Test message',
      };

      mockUseCase.execute.mockRejectedValueOnce(
        new InternalServerErrorException('Database error'),
      );

      await expect(controller.execute(inputDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should call useCase.execute exactly once', async () => {
      const inputDto: SubmitFormDto = {
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        message: 'Another message',
      };

      const mockEntity: FormSubmissionEntity = {
        id: 456,
        name: inputDto.name,
        email: inputDto.email,
        message: inputDto.message,
        createdAt: new Date(),
      };

      mockUseCase.execute.mockResolvedValueOnce(mockEntity);

      await controller.execute(inputDto);

      expect(useCase.execute).toHaveBeenCalledTimes(1);
    });

    it('should return ResponseDto with correct structure', async () => {
      const inputDto: SubmitFormDto = {
        name: 'Diana Prince',
        email: 'diana@example.com',
        message: 'Wonder message',
      };

      const mockEntity: FormSubmissionEntity = {
        id: 789,
        name: inputDto.name,
        email: inputDto.email,
        message: inputDto.message,
        createdAt: new Date('2025-07-20T15:45:00Z'),
      };

      mockUseCase.execute.mockResolvedValueOnce(mockEntity);

      const result = await controller.execute(inputDto);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('timestamp');
      expect(result.data).toHaveProperty('id');
      expect(result.data).toHaveProperty('createdAt');
      expect(result.data.id).toBe(789);
    });
  });
});

