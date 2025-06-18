import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';
import { WhatsAppAdapter } from './whatsapp.adapter';
import { NotificationDto } from '../presentation/dtos/notification.dto';

// 1) Preparamos el mock de Twilio
const mockCreate = jest.fn().mockResolvedValue({ sid: 'XYZ' });
const mockClient = { messages: { create: mockCreate } } as unknown as Twilio;

jest.mock('twilio', () => ({
  Twilio: jest.fn().mockImplementation(() => mockClient),
}));

describe('WhatsAppAdapter', () => {
  let adapter: WhatsAppAdapter;
  let configService: ConfigService;
  let MockTwilio: jest.MockedClass<typeof Twilio>;

  beforeEach(async () => {
    // 2) Config stub
    configService = {
      getOrThrow: jest.fn(
        (key: string) =>
          (
            ({
              TWILIO_ACCOUNT_SID: 'AC123',
              TWILIO_AUTH_TOKEN: 'TOKEN123',
              TWILIO_WHATSAPP_FROM: 'whatsapp:+1415XXXXXXX',
              TWILIO_WHATSAPP_TEMPLATE_SID: 'TEMPLATE_SID',
            }) as Record<string, string>
          )[key],
      ),
    } as unknown as ConfigService;

    // 3) Limpiamos registros **antes** de instanciar
    MockTwilio = Twilio as unknown as jest.MockedClass<typeof Twilio>;
    MockTwilio.mockClear();
    mockCreate.mockClear();

    // 4) Creamos el módulo y obtenemos el adapter
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WhatsAppAdapter,
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();
    adapter = module.get<WhatsAppAdapter>(WhatsAppAdapter);
  });

  it('should instantiate Twilio with correct credentials', () => {
    expect(MockTwilio).toHaveBeenCalledWith('AC123', 'TOKEN123');
    expect(MockTwilio).toHaveBeenCalledTimes(1);
  });

  it('should not call messages.create when no recipientPhone', async () => {
    await adapter.sendNotification({
      recipientEmail: 'a@b.com',
      subject: 'subj',
      message: 'msg',
    } as NotificationDto);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('should call messages.create with correct params', async () => {
    const dto: NotificationDto = {
      recipientEmail: 'a@b.com',
      subject: 'subj',
      message: 'msg',
      recipientPhone: '+34900111222',
      templateVariables: { date: '2025-06-20', time: '15:00' },
    };
    await adapter.sendNotification(dto);
    expect(mockCreate).toHaveBeenCalledWith({
      from: 'whatsapp:+1415XXXXXXX',
      to: `whatsapp:${dto.recipientPhone}`,
      contentSid: 'TEMPLATE_SID',
      contentVariables: JSON.stringify({ '1': '2025-06-20', '2': '15:00' }),
    });
  });
});
