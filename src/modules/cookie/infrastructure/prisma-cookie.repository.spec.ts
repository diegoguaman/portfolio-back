/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaCookieRepository } from './prisma-cookie.repository';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CookieConsentDto } from '../presentation/dtos/cookie-consent.dto';
import { CookieConsentEntity } from '../domain/cookie-consent.entity';

interface MockPrismaService {
  cookieConsent: {
    create: jest.Mock<Promise<CookieConsentEntity>, [{ data: CookieConsentDto }]>;
    findUnique: jest.Mock<Promise<CookieConsentEntity | null>, [any]>;
    findMany: jest.Mock<Promise<CookieConsentEntity[]>, [any]>;
    update: jest.Mock<Promise<CookieConsentEntity>, [any]>;
    delete: jest.Mock<Promise<CookieConsentEntity>, [any]>;
  };
}

describe('PrismaCookieRepository', () => {
  let repository: PrismaCookieRepository;
  let prisma: MockPrismaService;

  beforeEach(async () => {
    prisma = {
      cookieConsent: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaCookieRepository,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    repository = module.get<PrismaCookieRepository>(PrismaCookieRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create consent successfully', async () => {
    const dto: CookieConsentDto = {
      anonymousId: 'user-123',
      cookieName: 'analytics',
      consentGiven: true,
    };
    const created = { id: 1, ...dto, createdAt: new Date(), updatedAt: new Date(), metadata: null };

    prisma.cookieConsent.create.mockResolvedValueOnce(created);

    const result = await repository.createConsent(dto);

    expect(prisma.cookieConsent.create).toHaveBeenCalledWith({ data: dto });
    expect(result).toEqual(created);
  });

  it('should throw error on createConsent failure', async () => {
    const dto: CookieConsentDto = {
      anonymousId: 'user-123',
      cookieName: 'analytics',
      consentGiven: true,
    };

    prisma.cookieConsent.create.mockRejectedValueOnce(new Error('DB error'));

    await expect(repository.createConsent(dto)).rejects.toThrow('DB error');
    expect(prisma.cookieConsent.create).toHaveBeenCalledWith({ data: dto });
  });

  it('should find consent by anonId and name', async () => {
    const anonymousId = 'user-123';
    const cookieName = 'analytics';
    const consent = { id: 1, anonymousId, cookieName, consentGiven: true, createdAt: new Date(), updatedAt: new Date(), metadata: null };

    prisma.cookieConsent.findUnique.mockResolvedValueOnce(consent);

    const result = await repository.findByAnonAndName(anonymousId, cookieName);

    expect(prisma.cookieConsent.findUnique).toHaveBeenCalledWith({
      where: { anonymousId_cookieName: { anonymousId, cookieName } },
    });
    expect(result).toEqual(consent);
  });

  it('should return null if consent not found', async () => {
    prisma.cookieConsent.findUnique.mockResolvedValueOnce(null);

    const result = await repository.findByAnonAndName('user-123', 'analytics');

    expect(result).toBeNull();
  });

  it('should throw error on findByAnonAndName failure', async () => {
    prisma.cookieConsent.findUnique.mockRejectedValueOnce(new Error('DB error'));

    await expect(repository.findByAnonAndName('user-123', 'analytics')).rejects.toThrow('DB error');
  });

  // Añade tests similares para findAllByAnon, updateConsent, deleteConsent
  it('should find all consents by anonId', async () => {
    const anonymousId = 'user-123';
    const consents = [{ id: 1, anonymousId, cookieName: 'analytics', consentGiven: true, createdAt: new Date(), updatedAt: new Date(), metadata: null }];

    prisma.cookieConsent.findMany.mockResolvedValueOnce(consents);

    const result = await repository.findAllByAnon(anonymousId);

    expect(prisma.cookieConsent.findMany).toHaveBeenCalledWith({ where: { anonymousId } });
    expect(result).toEqual(consents);
  });

  it('should update consent successfully', async () => {
    const anonymousId = 'user-123';
    const cookieName = 'analytics';
    const consent = { id: 1, anonymousId, cookieName, consentGiven: true, createdAt: new Date(), updatedAt: new Date(), metadata: null };

    prisma.cookieConsent.update.mockResolvedValueOnce(consent);

    const result = await repository.updateConsent(anonymousId, cookieName, consent);

    expect(prisma.cookieConsent.update).toHaveBeenCalledWith({ where: { anonymousId_cookieName: { anonymousId, cookieName } }, data: consent });
    expect(result).toEqual(consent);
  });

  it('should throw error on updateConsent failure', async () => {
    const anonymousId = 'user-123';
    const cookieName = 'analytics';
    const consent = { id: 1, anonymousId, cookieName, consentGiven: true, createdAt: new Date(), updatedAt: new Date(), metadata: null };

    prisma.cookieConsent.update.mockRejectedValueOnce(new Error('DB error'));

    await expect(repository.updateConsent(anonymousId, cookieName, consent)).rejects.toThrow('DB error');
  });

  it('should delete consent successfully', async () => {
    const anonymousId = 'user-123';
    const cookieName = 'analytics';
    const consent = { id: 1, anonymousId, cookieName, consentGiven: true, createdAt: new Date(), updatedAt: new Date(), metadata: null };

    prisma.cookieConsent.delete.mockResolvedValueOnce(consent);

    await repository.deleteConsent(anonymousId, cookieName);

    expect(prisma.cookieConsent.delete).toHaveBeenCalledWith({ where: { anonymousId_cookieName: { anonymousId, cookieName } } });
  });

  it('should throw error on deleteConsent failure', async () => {
    const anonymousId = 'user-123';
    const cookieName = 'analytics';

    prisma.cookieConsent.delete.mockRejectedValueOnce(new Error('DB error'));

    await expect(repository.deleteConsent(anonymousId, cookieName)).rejects.toThrow('DB error');
  });
});