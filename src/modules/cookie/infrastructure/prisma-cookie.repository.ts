import { Injectable } from '@nestjs/common';
import { PrismaService } from './../../../../prisma/prisma.service';
import { CookieRepository } from '../domain/cookie.repository';
import { CookieConsentDto } from '../presentation/dtos/cookie-consent.dto';
import { CookieConsentEntity } from '../domain/cookie-consent.entity';

@Injectable()
export class PrismaCookieRepository implements CookieRepository {
  constructor(private readonly prisma: PrismaService) {}

  createConsent(data: CookieConsentDto): Promise<CookieConsentEntity> {
    return this.prisma.cookieConsent.create({ data });
  }

  findByCookieName(name: string): Promise<CookieConsentEntity | null> {
    return this.prisma.cookieConsent.findFirst({ where: { cookieName: name } });
  }
}
