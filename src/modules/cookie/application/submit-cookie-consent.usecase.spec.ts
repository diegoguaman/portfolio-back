/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { SubmitCookieConsentUseCase } from './submit-cookie-consent.usecase';
import { COOKIE_REPOSITORY_TOKEN } from '../domain/constants';
import { CookieRepository } from '../domain/cookie.repository';
import { CookieConsentDto } from '../presentation/dtos/cookie-consent.dto';
import { CookieConsentEntity } from '../domain/cookie-consent.entity';
import { ConflictException } from '@nestjs/common';

describe('SubmitCookieConsentUseCase', () => {
  let useCase: SubmitCookieConsentUseCase;
  let repo: jest.Mocked<CookieRepository>;

  beforeEach(async () => {
    repo = { createConsent: jest.fn(), findByCookieName: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubmitCookieConsentUseCase,
        { provide: COOKIE_REPOSITORY_TOKEN, useValue: repo },
      ],
    }).compile();
    useCase = module.get<SubmitCookieConsentUseCase>(
      SubmitCookieConsentUseCase,
    );
  });

  it('should throw ConflictException when consent already exists', async () => {
    const dto: CookieConsentDto = {
      cookieName: 'analytics',
      consentGiven: true,
    };
    const existing: CookieConsentEntity = {
      id: 1,
      cookieName: dto.cookieName,
      consentGiven: dto.consentGiven,
      createdAt: new Date(),
    };
    repo.findByCookieName.mockResolvedValueOnce(existing);

    await expect(useCase.execute(dto)).rejects.toThrow(ConflictException);
    expect(repo.findByCookieName).toHaveBeenCalledWith(dto.cookieName);
  });

  it('should create new consent if none exists', async () => {
    const dto: CookieConsentDto = { cookieName: 'ads', consentGiven: false };
    const created: CookieConsentEntity = {
      id: 2,
      cookieName: dto.cookieName,
      consentGiven: dto.consentGiven,
      createdAt: new Date(),
    };
    repo.findByCookieName.mockResolvedValueOnce(null);
    repo.createConsent.mockResolvedValueOnce(created);

    const result = await useCase.execute(dto);
    expect(repo.createConsent).toHaveBeenCalledWith(dto);
    expect(result).toBe(created);
  });
});
