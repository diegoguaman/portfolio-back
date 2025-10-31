import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as express from 'express';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { CookieConsentEntity } from './../src/modules/cookie/domain/cookie-consent.entity';
import {
  CookieConsentDto,
  UpdateCookieConsentDto,
} from './../src/modules/cookie/presentation/dtos/cookie-consent.dto';

// Tipado para respuestas para evitar ESLint errors
interface CookieConsentResponse extends Omit<CookieConsentEntity, 'metadata'> {
  metadata: Record<string, unknown> | null; // Tipado seguro para JSON
}

describe('CookieConsentController (e2e)', () => {
  let app: INestApplication<express.Express>; // Tipado explícito para Express;
  let prisma: PrismaService;
  const anonId: string = uuidv4();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    prisma = app.get(PrismaService);
  }, 30000);

  beforeEach(async () => {
    await prisma.cookieConsent.deleteMany(); //Limpieza antes de cada test
  });

  afterAll(async () => {
    await prisma.cookieConsent.deleteMany(); //Limpieza final
    await app.close();
  });

  it('/api/cookie-consent (POST) - should create consent', async () => {
    const dto: CookieConsentDto = {
      anonymousId: anonId,
      cookieName: 'analytics',
      consentGiven: true,
    };

    const response = await request(app.getHttpServer())
      .post('/api/cookie-consent')
      .set('X-Anonymous-ID', anonId)
      .send(dto)
      .expect(201);

    const createdConsent: CookieConsentResponse =
      response.body as CookieConsentResponse;
    expect(createdConsent.id).toBeDefined();
    expect(createdConsent.anonymousId).toBe(anonId);
    expect(createdConsent.cookieName).toBe('analytics');
    expect(createdConsent.consentGiven).toBe(true);
    expect(createdConsent.createdAt).toBeDefined();
  });

  it('/api/cookie-consent (POST) - should fail with invalid DTO', async () => {
    await request(app.getHttpServer())
      .post('/api/cookie-consent')
      .set('X-Anonymous-ID', anonId)
      .send({
        anonymousId: anonId,
        cookieName: '', // Inválido (vacío)
        consentGiven: true,
      })
      .expect(400); // BadRequest por validación
  });

  it('/api/cookie-consent (POST) - should fail with mismatched anonymousId', async () => {
    const dto: CookieConsentDto = {
      anonymousId: 'different-id',
      cookieName: 'analytics',
      consentGiven: true,
    };

    await request(app.getHttpServer())
      .post('/api/cookie-consent')
      .set('X-Anonymous-ID', anonId)
      .send(dto)
      .expect(400); // BadRequest por mismatch
  });

  it('/api/cookie-consent (GET) - should retrieve consents', async () => {
    // Crea uno para probar
    await request(app.getHttpServer())
      .post('/api/cookie-consent')
      .set('X-Anonymous-ID', anonId)
      .send({
        anonymousId: anonId,
        cookieName: 'marketing',
        consentGiven: true,
      } as CookieConsentDto)
      .expect(201);

    const response = await request(app.getHttpServer())
      .get('/api/cookie-consent?skip=0&take=10')
      .set('X-Anonymous-ID', anonId)
      .expect(200);

    const consents: CookieConsentResponse[] =
      response.body as CookieConsentResponse[];
    expect(consents).toBeInstanceOf(Array);
    expect(consents.length).toBeGreaterThan(0);
    expect(consents.some((c) => c.cookieName === 'marketing')).toBe(true);
  });

  it('/api/cookie-consent (PATCH) - should update consent', async () => {
    // Crea uno para actualizar
    await request(app.getHttpServer())
      .post('/api/cookie-consent')
      .set('X-Anonymous-ID', anonId)
      .send({
        anonymousId: anonId,
        cookieName: 'ads',
        consentGiven: true,
      } as CookieConsentDto)
      .expect(201);

    const response = await request(app.getHttpServer())
      .patch('/api/cookie-consent/ads')
      .set('X-Anonymous-ID', anonId)
      .send({ consentGiven: false } as UpdateCookieConsentDto)
      .expect(200);

    const updatedConsent: CookieConsentResponse =
      response.body as CookieConsentResponse;
    expect(updatedConsent.consentGiven).toBe(false);
    expect(updatedConsent.updatedAt).toBeDefined();
  });

  it('/api/cookie-consent (PATCH) - should fail if consent does not exist', async () => {
    await request(app.getHttpServer())
      .patch('/api/cookie-consent/nonexistent')
      .set('X-Anonymous-ID', anonId)
      .send({ consentGiven: false } as UpdateCookieConsentDto)
      .expect(404); // NotFound
  });

  it('/api/cookie-consent (DELETE) - should delete consent', async () => {
    // Crea uno para eliminar
    await request(app.getHttpServer())
      .post('/api/cookie-consent')
      .set('X-Anonymous-ID', anonId)
      .send({
        anonymousId: anonId,
        cookieName: 'tracking',
        consentGiven: true,
      } as CookieConsentDto)
      .expect(201);

    await request(app.getHttpServer())
      .delete('/api/cookie-consent/tracking')
      .set('X-Anonymous-ID', anonId)
      .expect(204); // No Content

    await request(app.getHttpServer())
      .get('/api/cookie-consent?skip=0&take=10')
      .set('X-Anonymous-ID', anonId)
      .expect(404);
  });

  it('/api/cookie-consent (DELETE) - should fail if consent does not exist', async () => {
    await request(app.getHttpServer())
      .delete('/api/cookie-consent/nonexistent')
      .set('X-Anonymous-ID', anonId)
      .expect(404); // NotFound
  });

  it('/api/cookie-consent (GET) - should fail with invalid skip/take', async () => {
    await request(app.getHttpServer())
      .get('/api/cookie-consent?skip=abc&take=-10')
      .set('X-Anonymous-ID', anonId)
      .expect(400);
  });
});
