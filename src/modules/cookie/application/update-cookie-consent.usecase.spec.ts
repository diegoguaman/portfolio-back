import { Test, TestingModule } from '@nestjs/testing';
import { UpdateCookieConsentUseCase } from './update-cookie-consent.usecase';
import {
  COOKIE_REPOSITORY_TOKEN,
  CookieRepository,
} from '../domain/cookie.repository';
import { UpdateCookieConsentDto } from '../presentation/dtos/cookie-consent.dto';
import { CookieConsentEntity } from '../domain/cookie-consent.entity';
import { NotFoundException } from '@nestjs/common';

describe('UpdateCookieConsentUseCase', () => {
  let useCase: UpdateCookieConsentUseCase;
  let mockRepo: jest.Mocked<CookieRepository>;

  const mockCookieRepository = {
    createConsent: jest.fn(),
    findByAnonAndName: jest.fn(),
    findAllByAnon: jest.fn(),
    updateConsent: jest.fn(),
    deleteConsent: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateCookieConsentUseCase,
        {
          provide: COOKIE_REPOSITORY_TOKEN,
          useValue: mockCookieRepository,
        },
      ],
    }).compile();

    useCase = module.get<UpdateCookieConsentUseCase>(
      UpdateCookieConsentUseCase,
    );
    mockRepo = module.get(COOKIE_REPOSITORY_TOKEN);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update an existing consent', async () => {
    const anonymousId = 'uuid-123';
    const cookieName = 'analytics';
    const dto: UpdateCookieConsentDto = { consentGiven: false };
    const existingConsent: CookieConsentEntity = {
      id: 1,
      anonymousId,
      cookieName,
      consentGiven: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: null,
    };
    const updatedConsent: CookieConsentEntity = {
      ...existingConsent,
      consentGiven: false,
      updatedAt: new Date(),
    };

    mockRepo.findByAnonAndName.mockResolvedValue(existingConsent);
    mockRepo.updateConsent.mockResolvedValue(updatedConsent);

    const result = await useCase.execute(anonymousId, cookieName, dto);

    expect(mockRepo.findByAnonAndName).toHaveBeenCalledWith(
      anonymousId,
      cookieName,
    );
    expect(mockRepo.updateConsent).toHaveBeenCalledWith(
      anonymousId,
      cookieName,
      dto,
    );
    expect(result).toEqual(updatedConsent);
  });

  it('should throw NotFoundException if consent does not exist', async () => {
    const anonymousId = 'uuid-123';
    const cookieName = 'analytics';
    const dto: UpdateCookieConsentDto = { consentGiven: false };

    mockRepo.findByAnonAndName.mockResolvedValue(null);

    await expect(useCase.execute(anonymousId, cookieName, dto)).rejects.toThrow(
      NotFoundException,
    );
    expect(mockRepo.updateConsent).not.toHaveBeenCalled();
  });
});
