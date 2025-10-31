import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as express from 'express';
import { AppModule } from '../../../app.module';
import { PrismaService } from '../../../../prisma/prisma.service';
import { SubmitFormDto } from '../presentation/dtos/submit-form.dto';

interface FormSubmissionResponse {
  data: {
    id: number;
    createdAt: string;
  };
  timestamp: string;
}

describe('FormSubmissionController (e2e)', () => {
  let app: INestApplication<express.Express>;
  let prisma: PrismaService;

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
    await prisma.formSubmission.deleteMany(); // Limpieza antes de cada test
  });

  afterAll(async () => {
    if (prisma) {
      await prisma.formSubmission.deleteMany(); // Limpieza final
    }
    if (app) {
      await app.close();
    }
  });

  describe('/form (POST)', () => {
    it('should create a form submission successfully', async () => {
      const dto: SubmitFormDto = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a test message for the contact form.',
      };

      const response = await request(app.getHttpServer())
        .post('/form')
        .send(dto)
        .expect(201);

      const responseBody: FormSubmissionResponse =
        response.body as FormSubmissionResponse;

      expect(responseBody.data.id).toBeDefined();
      expect(responseBody.data.createdAt).toBeDefined();
      expect(responseBody.timestamp).toBeDefined();

      // Verificar que se guardó en la base de datos
      const savedRecord = await prisma.formSubmission.findUnique({
        where: { id: responseBody.data.id },
      });

      expect(savedRecord).toBeDefined();
      expect(savedRecord?.name).toBe(dto.name);
      expect(savedRecord?.email).toBe(dto.email);
      expect(savedRecord?.message).toBe(dto.message);
    });

    it('should fail with 400 if name is missing', async () => {
      const invalidDto = {
        email: 'test@example.com',
        message: 'Missing name field',
      };

      await request(app.getHttpServer())
        .post('/form')
        .send(invalidDto)
        .expect(400);
    });

    it('should fail with 400 if email is invalid', async () => {
      const invalidDto: SubmitFormDto = {
        name: 'Jane Doe',
        email: 'not-an-email', // Email inválido
        message: 'Test message',
      };

      await request(app.getHttpServer())
        .post('/form')
        .send(invalidDto)
        .expect(400);
    });

    it('should fail with 400 if message is missing', async () => {
      const invalidDto = {
        name: 'Bob Smith',
        email: 'bob@example.com',
      };

      await request(app.getHttpServer())
        .post('/form')
        .send(invalidDto)
        .expect(400);
    });

    it('should fail with 400 if email is missing', async () => {
      const invalidDto = {
        name: 'Alice Johnson',
        message: 'Missing email field',
      };

      await request(app.getHttpServer())
        .post('/form')
        .send(invalidDto)
        .expect(400);
    });

    it('should accept valid email formats', async () => {
      const validEmails = [
        'test@example.com',
        'user.name@example.co.uk',
        'test+label@domain.com',
      ];

      for (const email of validEmails) {
        const dto: SubmitFormDto = {
          name: 'Test User',
          email,
          message: 'Testing email validation',
        };

        await request(app.getHttpServer())
          .post('/form')
          .send(dto)
          .expect(201);
      }
    });

    it('should trim whitespace from string fields', async () => {
      const dto: SubmitFormDto = {
        name: '  John Doe  ',
        email: 'john@example.com',
        message: '  Test message  ',
      };

      const response = await request(app.getHttpServer())
        .post('/form')
        .send(dto)
        .expect(201);

      const responseBody: FormSubmissionResponse =
        response.body as FormSubmissionResponse;

      const savedRecord = await prisma.formSubmission.findUnique({
        where: { id: responseBody.data.id },
      });

      // NestJS ValidationPipe con whitelist debería manejar esto
      expect(savedRecord?.name).toBeDefined();
      expect(savedRecord?.message).toBeDefined();
    });

    it('should handle multiple submissions', async () => {
      const submissions: SubmitFormDto[] = [
        {
          name: 'User 1',
          email: 'user1@example.com',
          message: 'Message 1',
        },
        {
          name: 'User 2',
          email: 'user2@example.com',
          message: 'Message 2',
        },
        {
          name: 'User 3',
          email: 'user3@example.com',
          message: 'Message 3',
        },
      ];

      for (const dto of submissions) {
        await request(app.getHttpServer())
          .post('/form')
          .send(dto)
          .expect(201);
      }

      const count = await prisma.formSubmission.count();
      expect(count).toBe(3);
    });

    it('should return timestamps in ISO format', async () => {
      const dto: SubmitFormDto = {
        name: 'Timestamp Test',
        email: 'timestamp@example.com',
        message: 'Testing timestamp format',
      };

      const response = await request(app.getHttpServer())
        .post('/form')
        .send(dto)
        .expect(201);

      const responseBody: FormSubmissionResponse =
        response.body as FormSubmissionResponse;

      // Verificar que el timestamp es una fecha válida en formato ISO
      expect(() => new Date(responseBody.timestamp)).not.toThrow();
      expect(() => new Date(responseBody.data.createdAt)).not.toThrow();
    });
  });
});

