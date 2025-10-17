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
    try {
      this.logger.log(`Creando consentimiento para cookie: ${data.cookieName}`);
      const created = await this.prisma.cookieConsent.create({ data });
      return {
        id: created.id,
        anonymousId: created.anonymousId,
        cookieName: created.cookieName,
        consentGiven: created.consentGiven,
        createdAt: created.createdAt,
        updatedAt: created.updatedAt,
        metadata: created.metadata,
      };
    } catch (error) {
      this.logger.error(`Error al crear consentimiento para cookie: ${error}`);
      throw error;
    }
  }

  async findByAnonAndName(
    anonymousId: string,
    name: string,
  ): Promise<CookieConsentEntity | null> {
    return this.prisma.cookieConsent.findUnique({
      where: { anonymousId_cookieName: { anonymousId, cookieName: name } },
    });
  }

  async findAllByAnon(
    anonymousId: string,
    options?: { skip: number; take: number },
  ): Promise<CookieConsentEntity[]> {
    try {
      return this.prisma.cookieConsent.findMany({
        where: { anonymousId },
        skip: options?.skip,
        take: options?.take,
      });
    } catch (error) {
      this.logger.error(
        `Error al obtener consentimientos para anonymousId: ${anonymousId}`,
      );
      throw error;
    }
  }

  async updateConsent(
    anonymousId: string,
    name: string,
    data: Partial<CookieConsentDto>,
  ): Promise<CookieConsentEntity> {
    try {
      this.logger.log(
        `Actualizando consentimiento para anonymousId: ${anonymousId}, cookie: ${name}`,
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
    } catch (error) {
      this.logger.error(`Error updating consent: ${error}`);
      throw error;
    }
  }

  async deleteConsent(anonymousId: string, name: string): Promise<void> {
    try {
      this.logger.warn(
        `Eliminando consentimiento para anonymousId: ${anonymousId}, cookie: ${name}`,
      );
      await this.prisma.cookieConsent.delete({
        where: { anonymousId_cookieName: { anonymousId, cookieName: name } },
      });
    } catch (error) {
      this.logger.error(`Error deleting consent: ${error}`);
      throw error;
    }
  }
}
