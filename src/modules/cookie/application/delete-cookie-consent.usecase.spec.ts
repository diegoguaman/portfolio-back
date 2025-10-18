/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { DeleteCookieConsentUseCase } from './delete-cookie-consent.usecase';
import {
  CookieRepository,
  COOKIE_REPOSITORY_TOKEN,
} from '../domain/cookie.repository';
import { NotFoundException } from '@nestjs/common';
import { CookieConsentEntity } from '../domain/cookie-consent.entity';

interface MockCookieRepository extends CookieRepository {
  createConsent: jest.Mock<Promise<CookieConsentEntity>, [any]>;
  findByAnonAndName: jest.Mock<Promise<CookieConsentEntity | null>, [string, string]>;
  findAllByAnon: jest.Mock<Promise<CookieConsentEntity[]>, [string, { skip: number; take: number }?]>;
  updateConsent: jest.Mock<Promise<CookieConsentEntity>, [string, string, any]>;
  deleteConsent: jest.Mock<Promise<void>, [string, string]>;
}

describe('DeleteCookieConsentUseCase', () => {
  let useCase: DeleteCookieConsentUseCase;
  let repo: MockCookieRepository;

  beforeEach(async () => {
    repo = {
      createConsent: jest.fn(),
      findByAnonAndName: jest.fn(),
      findAllByAnon: jest.fn(),
      updateConsent: jest.fn(),
      deleteConsent: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteCookieConsentUseCase,
        { provide: COOKIE_REPOSITORY_TOKEN, useValue: repo },
      ],
    }).compile();
    useCase = module.get<DeleteCookieConsentUseCase>(
      DeleteCookieConsentUseCase,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete consent successfully', async () => {
    const anonymousId = 'user-123';
    const cookieName = 'analytics';
    const existingConsent = {
      id: 1,
      anonymousId,
      cookieName,
      consentGiven: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: null,
    };

    repo.findByAnonAndName.mockResolvedValueOnce(existingConsent);
    repo.deleteConsent.mockResolvedValueOnce();

    await useCase.execute(anonymousId, cookieName);

    expect(repo.findByAnonAndName).toHaveBeenCalledWith(
      anonymousId,
      cookieName,
    );
    expect(repo.deleteConsent).toHaveBeenCalledWith(anonymousId, cookieName);
  });

  it('should throw NotFoundException if consent does not exist', async () => {
    const anonymousId = 'user-123';
    const cookieName = 'analytics';

    repo.findByAnonAndName.mockResolvedValueOnce(null);

    await expect(useCase.execute(anonymousId, cookieName)).rejects.toThrow(
      NotFoundException,
    );
    await expect(useCase.execute(anonymousId, cookieName)).rejects.toThrow(
      `Consent not found for ${cookieName}`,
    );
    expect(repo.findByAnonAndName).toHaveBeenCalledWith(
      anonymousId,
      cookieName,
    );
    expect(repo.deleteConsent).not.toHaveBeenCalled();
  });
});
