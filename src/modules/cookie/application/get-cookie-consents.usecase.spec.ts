/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { GetCookieConsentsUseCase } from './get-cookie-consents.usecase';
import {
  CookieRepository,
  COOKIE_REPOSITORY_TOKEN,
} from '../domain/cookie.repository';
import { NotFoundException } from '@nestjs/common';
import { CookieConsentEntity } from '../domain/cookie-consent.entity';

interface MockCookieRepository extends CookieRepository {
  createConsent: jest.Mock<Promise<CookieConsentEntity>, [any]>;
  findByAnonAndName: jest.Mock<
    Promise<CookieConsentEntity | null>,
    [string, string]
  >;
  findAllByAnon: jest.Mock<
    Promise<CookieConsentEntity[]>,
    [string, { skip: number; take: number } | undefined]
  >;
  updateConsent: jest.Mock<Promise<CookieConsentEntity>, [string, string, any]>;
  deleteConsent: jest.Mock<Promise<void>, [string, string]>;
}

describe('GetCookieConsentsUseCase', () => {
  let useCase: GetCookieConsentsUseCase;
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
        GetCookieConsentsUseCase,
        { provide: COOKIE_REPOSITORY_TOKEN, useValue: repo },
      ],
    }).compile();
    useCase = module.get<GetCookieConsentsUseCase>(GetCookieConsentsUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return consents successfully', async () => {
    const anonymousId = 'user-123';
    const consents: CookieConsentEntity[] = [
      {
        id: 1,
        anonymousId,
        cookieName: 'analytics',
        consentGiven: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: null,
      },
    ];

    repo.findAllByAnon.mockResolvedValueOnce(consents);

    const result = await useCase.execute(anonymousId, { skip: 0, take: 10 });

    expect(repo.findAllByAnon).toHaveBeenCalledWith(anonymousId, {
      skip: 0,
      take: 10,
    });
    expect(result).toEqual(consents);
  });

  it('should throw NotFoundException if no consents found', async () => {
    const anonymousId = 'user-123';
    const options = { skip: 0, take: 10 };

    repo.findAllByAnon.mockResolvedValueOnce([]);

    try {
      await useCase.execute(anonymousId, options);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toEqual(`No consents found for ${anonymousId}`);
    }

    expect(repo.findAllByAnon).toHaveBeenCalledWith(anonymousId, options);
  });

  it('should work without options parameter', async () => {
    const anonymousId = 'user-123';
    const consents = [
      {
        id: 1,
        anonymousId,
        cookieName: 'test',
        consentGiven: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: null,
      },
    ];

    repo.findAllByAnon.mockResolvedValueOnce(consents);
    const result = await useCase.execute(anonymousId);

    expect(repo.findAllByAnon).toHaveBeenCalledWith(anonymousId, undefined);
    expect(result).toEqual(consents);
  });

  it('should rethrow errors from the repository', async () => {
    const anonymousId = 'user-123';
    const error = new Error('Database error');
    repo.findAllByAnon.mockRejectedValueOnce(error);

    await expect(useCase.execute(anonymousId)).rejects.toThrow(error);
  });
});
