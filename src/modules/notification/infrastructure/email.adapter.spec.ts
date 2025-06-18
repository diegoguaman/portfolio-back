import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';
import { EmailAdapter } from './email.adapter';
import { NotificationDto } from '../presentation/dtos/notification.dto';

// 1. Mock completo de @sendgrid/mail
jest.mock('@sendgrid/mail');

describe('EmailAdapter', () => {
  let adapter: EmailAdapter;
  let configService: ConfigService;
  const setApiKeyMock = jest.spyOn(SendGrid, 'setApiKey').mockImplementation();
  const sendMock = jest
    .spyOn(SendGrid, 'send')
    .mockResolvedValue([{ statusCode: 202 } as SendGrid.ClientResponse, {}]);

  beforeEach(async () => {
    // 2. ConfigService stub con getOrThrow usando solo keys que necesitamos
    configService = {
      get: jest.fn((key: string) => {
        if (key === 'SENDGRID_API_KEY') return 'SG.TEST_API_KEY';
        if (key === 'SMTP_FROM') return 'no-reply@domain.com';
        return undefined;
      }),
      // No usamos getOrThrow, EmailAdapter usa get+throw
    } as any as ConfigService;

    // 3. Montamos el módulo y obtenemos el adapter
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailAdapter,
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    adapter = module.get<EmailAdapter>(EmailAdapter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize SendGrid with the API key from config', () => {
    expect(setApiKeyMock).toHaveBeenCalledWith('SG.TEST_API_KEY');
  });

  it('should throw if SENDGRID_API_KEY is missing', async () => {
    // ConfigService sin la key
    const badConfig = { get: () => undefined } as any as ConfigService;
    await expect(async () => {
      const mod = await Test.createTestingModule({
        providers: [
          EmailAdapter,
          { provide: ConfigService, useValue: badConfig },
        ],
      }).compile();
      mod.get<EmailAdapter>(EmailAdapter);
    }).rejects.toThrow('Missing SENDGRID_API_KEY in environment');
  });

  it('should call SendGrid.send with correct message payload', async () => {
    const dto: NotificationDto = {
      recipientEmail: 'user@example.com',
      subject: 'Test Subject',
      message: 'Test Body',
    };

    await adapter.sendNotification(dto);

    expect(sendMock).toHaveBeenCalledWith({
      to: dto.recipientEmail,
      from: 'no-reply@domain.com',
      subject: dto.subject,
      text: dto.message,
    });
  });

  it('should default from to no-reply@tu-dominio.com if SMTP_FROM is not set', async () => {
    // ConfigService without SMTP_FROM
    (configService.get as jest.Mock).mockImplementation((key: string) => {
      if (key === 'SENDGRID_API_KEY') return 'SG.TEST_API_KEY';
      return undefined;
    });
    const mod = await Test.createTestingModule({
      providers: [
        EmailAdapter,
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();
    const noFromAdapter = mod.get<EmailAdapter>(EmailAdapter);

    const dto: NotificationDto = {
      recipientEmail: 'foo@bar.com',
      subject: 'Hi',
      message: 'Hello',
    };

    await noFromAdapter.sendNotification(dto);

    expect(sendMock).toHaveBeenCalledWith({
      to: dto.recipientEmail,
      from: 'no-reply@tu-dominio.com',
      subject: dto.subject,
      text: dto.message,
    });
  });
});
