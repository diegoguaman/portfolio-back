import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './../../../../prisma/prisma.service';
import { CookieRepository } from '../domain/cookie.repository';
import { CookieConsentDto } from '../presentation/dtos/cookie-consent.dto';
import { CookieConsentEntity } from '../domain/cookie-consent.entity';

@Injectable()
export class PrismaCookieRepository implements CookieRepository {
  private readonly logger = new Logger(PrismaCookieRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async createConsent(data: CookieConsentDto): Promise<CookieConsentEntity> {
    this.logger.log(`Creando consentimiento para cookie: ${data.cookieName}`);
    return this.prisma.cookieConsent.create({ data });
  }

  async findByUserAndName(
    anonymousId: string,
    name: string,
  ): Promise<CookieConsentEntity | null> {
    return this.prisma.cookieConsent.findUnique({
      where: { anonymousId_cookieName: { anonymousId, cookieName: name } },
    });
  }

  async findAllByUser(
    anonymousId: string,
    options?: { skip: number; take: number },
  ): Promise<CookieConsentEntity[]> {
    return this.prisma.cookieConsent.findMany({
      where: { anonymousId },
      skip: options?.skip,
      take: options?.take,
    });
  }

  async updateConsent(
    anonymousId: string,
    name: string,
    data: Partial<CookieConsentDto>,
  ): Promise<CookieConsentEntity> {
    this.logger.log(
      `Actualizando consentimiento para userId: ${anonymousId}, cookie: ${name}`,
    );

    const updateData = {
      ...data,
      updatedAt: new Date(),
    };

    const updated = await this.prisma.cookieConsent.update({
      where: { anonymousId_cookieName: { anonymousId, cookieName: name } },
      data: updateData,
    });

    return {
      id: updated.id,
      anonymousId: updated.anonymousId,
      cookieName: updated.cookieName,
      consentGiven: updated.consentGiven,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
      metadata: updated.metadata,
    };
  }

  async deleteConsent(anonymousId: string, name: string): Promise<void> {
    this.logger.warn(
      `Eliminando consentimiento para userId: ${anonymousId}, cookie: ${name}`,
    );
    await this.prisma.cookieConsent.delete({
      where: { anonymousId_cookieName: { anonymousId, cookieName: name } },
    });
  }
}
