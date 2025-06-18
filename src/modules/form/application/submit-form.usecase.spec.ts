/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { SubmitFormUseCase } from './submit-form.usecase';
import { FormRepository } from '../domain/form.repository';
import { SubmitFormDto } from '../presentation/dtos/submit-form.dto';
import { FormSubmissionEntity } from '../domain/form.entity';
import { FORM_REPOSITORY_TOKEN } from '../domain/constants';

describe('SubmitFormUseCase', () => {
  let useCase: SubmitFormUseCase;
  let repo: jest.Mocked<FormRepository>;

  beforeEach(async () => {
    // Creamos el mock con una función flecha (sin extraer métodos)
    repo = {
      create: jest.fn().mockResolvedValue({
        id: 1,
        name: 'Alice',
        email: 'a@example.com',
        message: 'Hello',
        cookies: {},
        createdAt: new Date(),
      } as FormSubmissionEntity),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubmitFormUseCase,
        { provide: FORM_REPOSITORY_TOKEN, useValue: repo },
      ],
    }).compile();
    useCase = module.get<SubmitFormUseCase>(SubmitFormUseCase);
  });

  it('should call repo.create with the DTO and return its result', async () => {
    const dto: SubmitFormDto = {
      name: 'Alice',
      email: 'a@example.com',
      message: 'Hello',
      cookies: {},
    };
    const fake: FormSubmissionEntity = {
      id: 42,
      name: dto.name,
      email: dto.email,
      message: dto.message,
      cookies: dto.cookies,
      createdAt: new Date(),
    };
    // Configuramos la llamada específica para este caso
    repo.create.mockResolvedValueOnce(fake);

    const result = await useCase.execute(dto);

    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(result).toBe(fake);
  });
});
