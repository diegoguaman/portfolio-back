// src/modules/cookie/integration/cookie-consent.integration.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../app.module';
import { PrismaService } from './../../../../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { CookieConsentEntity } from '../domain/cookie-consent.entity';
import { CookieConsentDto, UpdateCookieConsentDto } from '../presentation/dtos/cookie-consent.dto';

// Definimos el tipo de la respuesta para evitar errores de ESLint
interface CookieConsentResponse extends CookieConsentEntity {
  // Asegura que los campos esperados estén tipados
}

describe('CookieConsent Integration Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const anonId: string = uuidv4(); // Tipamos explícitamente como string

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    prisma = app.get(PrismaService);
    await prisma.cookieConsent.deleteMany(); // Limpia la DB antes de tests
  });

  afterAll(async () => {
    await prisma.cookieConsent.deleteMany();
    await app.close();
  });

  it('should create and retrieve a consent', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/api/cookie-consent')
      .set('X-Anonymous-ID', anonId)
      .send({
        anonymousId: anonId,
        cookieName: 'analytics',
        consentGiven: true,
      } as CookieConsentDto)
      .expect(201);

    const createdConsent: CookieConsentResponse = createResponse.body;
    expect(createdConsent.id).toBeDefined();
    expect(createdConsent.anonymousId).toBe(anonId);
    expect(createdConsent.cookieName).toBe('analytics');
    expect(createdConsent.consentGiven).toBe(true);

    const getResponse = await request(app.getHttpServer())
      .get('/api/cookie-consent?skip=0&take=10')
      .set('X-Anonymous-ID', anonId)
      .expect(200);

    const consents: CookieConsentResponse[] = getResponse.body;
    expect(consents).toHaveLength(1);
    expect(consents[0].id).toBe(createdConsent.id);
  });

  it('should update an existing consent', async () => {
    await request(app.getHttpServer())
      .post('/api/cookie-consent')
      .set('X-Anonymous-ID', anonId)
      .send({
        anonymousId: anonId,
        cookieName: 'marketing',
        consentGiven: true,
      })
      .expect(201);

    const updateResponse = await request(app.getHttpServer())
      .patch('/api/cookie-consent/marketing')
      .set('X-Anonymous-ID', anonId)
      .send({ consentGiven: false } as UpdateCookieConsentDto)
      .expect(200);

    const updatedConsent: CookieConsentResponse = updateResponse.body;
    expect(updatedConsent.consentGiven).toBe(false);
    expect(updatedConsent.updatedAt).toBeDefined();
  });

  it('should delete a consent', async () => {
    await request(app.getHttpServer())
      .post('/api/cookie-consent')
      .set('X-Anonymous-ID', anonId)
      .send({
        anonymousId: anonId,
        cookieName: 'ads',
        consentGiven: true,
      })
      .expect(201);

    await request(app.getHttpServer())
      .delete('/api/cookie-consent/ads')
      .set('X-Anonymous-ID', anonId)
      .expect(204);

    const getResponse = await request(app.getHttpServer())
      .get('/api/cookie-consent?skip=0&take=10')
      .set('X-Anonymous-ID', anonId)
      .expect(200);

    const consents: CookieConsentResponse[] = getResponse.body;
    expect(consents.find((c) => c.cookieName === 'ads')).toBeUndefined();
  });

  it('should return 400 for invalid anonymousId', async () => {
    await request(app.getHttpServer())
      .post('/api/cookie-consent')
      .set('X-Anonymous-ID', 'invalid-id')
      .send({
        anonymousId: 'different-id',
        cookieName: 'analytics',
        consentGiven: true,
      })
      .expect(400);
  });
});
