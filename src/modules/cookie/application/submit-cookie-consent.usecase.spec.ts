import { Test, TestingModule } from '@nestjs/testing';
import { SubmitCookieConsentUseCase } from './submit-cookie-consent.usecase';
import { COOKIE_REPOSITORY_TOKEN } from '../domain/cookie.repository';
import { CookieRepository } from '../domain/cookie.repository';
import { CookieConsentDto } from '../presentation/dtos/cookie-consent.dto';
import { CookieConsentEntity } from '../domain/cookie-consent.entity';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('SubmitCookieConsentUseCase', () => {
  let useCase: SubmitCookieConsentUseCase;
  let repo: jest.Mocked<CookieRepository>;

  // Definimos el mock del repositorio
  const mockCookieRepository: CookieRepository = {
    createConsent: jest.fn(),
    findByAnonAndName: jest.fn(),
    findAllByAnon: jest.fn(),
    updateConsent: jest.fn(),
    deleteConsent: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubmitCookieConsentUseCase,
        { provide: COOKIE_REPOSITORY_TOKEN, useValue: mockCookieRepository },
      ],
    }).compile();
    useCase = module.get<SubmitCookieConsentUseCase>(
      SubmitCookieConsentUseCase,
    );
    repo = module.get(COOKIE_REPOSITORY_TOKEN);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new consent if none exists', async () => {
    // Datos de entrada
    const dto: CookieConsentDto = {
      anonymousId: 'uuid-123',
      cookieName: 'analytics',
      consentGiven: true,
    };
    const createdConsent: CookieConsentEntity = {
      id: 1,
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: null,
    };

    // Configuramos el mock
    repo.findByAnonAndName.mockResolvedValue(null);
    repo.createConsent.mockResolvedValue(createdConsent);

    // Ejecutamos el use case
    const result = await useCase.execute(dto);

    // Verificamos
    expect(repo.findByAnonAndName).toHaveBeenCalledWith(
      dto.anonymousId,
      dto.cookieName,
    );
    expect(repo.createConsent).toHaveBeenCalledWith(dto);
    expect(result).toEqual(createdConsent);
  });

  it('should throw ConflictException when consent already exists', async () => {
    const dto: CookieConsentDto = {
      anonymousId: 'uuid-1123',
      cookieName: 'analytics',
      consentGiven: true,
    };
    const existing: CookieConsentEntity = {
      id: 1,
      anonymousId: dto.anonymousId, // Alineado con anonymousId
      cookieName: dto.cookieName,
      consentGiven: dto.consentGiven,
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: null,
    };
    repo.findByAnonAndName.mockResolvedValueOnce(existing);

    await expect(useCase.execute(dto)).rejects.toThrow(ConflictException);
    expect(repo.findByAnonAndName).toHaveBeenCalledWith(
      dto.anonymousId,
      dto.cookieName,
    );
    expect(repo.createConsent).not.toHaveBeenCalled();
  });

  it('should throw InternalServerErrorException on unexpected error', async () => {
    const dto: CookieConsentDto = {
      anonymousId: 'uuid-123',
      cookieName: 'analytics',
      consentGiven: true,
    };

    repo.findByAnonAndName.mockRejectedValue(new Error('Database error'));

    await expect(useCase.execute(dto)).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('should throw BadRequestException if anonymousId is missing', async () => {
    const dto: CookieConsentDto = {
      anonymousId: '',
      cookieName: 'analytics',
      consentGiven: true,
    };

    await expect(useCase.execute(dto)).rejects.toThrow(
      'anonymousId is required',
    );
  });
});
