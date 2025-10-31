/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { SubmitFormUseCase } from './submit-form.usecase';
import {
  FormRepository,
  FORM_REPOSITORY_TOKEN,
} from '../domain/form.repository';
import { SubmitFormDto } from '../presentation/dtos/submit-form.dto';
import { FormSubmissionEntity } from '../domain/form.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { N8nWebhookAdapter } from '../infrastructure/n8n-webhook.adapter';

// Tipado para mock
interface MockFormRepository extends FormRepository {
  create: jest.Mock<Promise<FormSubmissionEntity>, [SubmitFormDto]>;
}

describe('SubmitFormUseCase', () => {
  let useCase: SubmitFormUseCase;
  let repo: MockFormRepository;
  let n8nWebhook: jest.Mocked<N8nWebhookAdapter>;

  beforeEach(async () => {
    // Creamos el mock con una función flecha (sin extraer métodos)
    repo = {
      create: jest.fn(),
    };
    n8nWebhook = {
      notifyFormSubmission: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<N8nWebhookAdapter>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubmitFormUseCase,
        { provide: FORM_REPOSITORY_TOKEN, useValue: repo },
        { provide: N8nWebhookAdapter, useValue: n8nWebhook },
      ],
    }).compile();
    useCase = module.get<SubmitFormUseCase>(SubmitFormUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call repo.create with the DTO and return its result', async () => {
    const dto: SubmitFormDto = {
      name: 'Alice',
      email: 'a@example.com',
      message: 'Hello',
    };
    const fake: FormSubmissionEntity = {
      id: 42,
      name: dto.name,
      email: dto.email,
      message: dto.message,
      createdAt: new Date(),
    };
    // Configuramos la llamada específica para este caso
    repo.create.mockResolvedValueOnce(fake);

    const result = await useCase.execute(dto);

    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(result).toBe(fake);
    expect(n8nWebhook.notifyFormSubmission).toHaveBeenCalledWith(fake);
  });

  it('should throw InternalServerErrorException if repository fails', async () => {
    const dto: SubmitFormDto = {
      name: 'Alice',
      email: 'a@example.com',
      message: 'Hello',
    };

    repo.create.mockRejectedValueOnce(new Error('DB error'));

    await expect(useCase.execute(dto)).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(useCase.execute(dto)).rejects.toThrow(
      'Error al procesar el envío del formulario',
    );
  });
});
