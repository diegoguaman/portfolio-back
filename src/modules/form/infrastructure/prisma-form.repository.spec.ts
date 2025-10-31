import { Test, TestingModule } from '@nestjs/testing';
import { PrismaFormRepository } from './prisma-form.repository';
import { PrismaService } from '../../../../prisma/prisma.service';
import { SubmitFormDto } from '../presentation/dtos/submit-form.dto';
import { FormSubmissionEntity } from '../domain/form.entity';

describe('PrismaFormRepository', () => {
  let repository: PrismaFormRepository;
  let prismaService: jest.Mocked<PrismaService>;

  const mockPrismaService = {
    formSubmission: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaFormRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<PrismaFormRepository>(PrismaFormRepository);
    prismaService = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a form submission successfully', async () => {
      const inputDto: SubmitFormDto = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a test message',
      };

      const expectedResult: FormSubmissionEntity = {
        id: 1,
        name: inputDto.name,
        email: inputDto.email,
        message: inputDto.message,
        createdAt: new Date('2025-01-01'),
      };

      mockPrismaService.formSubmission.create.mockResolvedValueOnce(
        expectedResult,
      );

      const result = await repository.create(inputDto);

      expect(prismaService.formSubmission.create).toHaveBeenCalledWith({
        data: {
          name: inputDto.name,
          email: inputDto.email,
          message: inputDto.message,
          createdAt: expect.any(Date),
        },
      });
      expect(result).toEqual(expectedResult);
    });

    it('should throw error if prisma create fails', async () => {
      const inputDto: SubmitFormDto = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a test message',
      };

      const errorMessage = 'Database connection failed';
      mockPrismaService.formSubmission.create.mockRejectedValueOnce(
        new Error(errorMessage),
      );

      await expect(repository.create(inputDto)).rejects.toThrow(errorMessage);
    });

    it('should call prisma with correct date format', async () => {
      const inputDto: SubmitFormDto = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        message: 'Another test',
      };

      const mockDate = new Date('2025-06-15T10:30:00Z');
      mockPrismaService.formSubmission.create.mockResolvedValueOnce({
        id: 2,
        ...inputDto,
        createdAt: mockDate,
      });

      await repository.create(inputDto);

      const callArgs = mockPrismaService.formSubmission.create.mock.calls[0][0];
      expect(callArgs.data.createdAt).toBeInstanceOf(Date);
    });
  });
});

