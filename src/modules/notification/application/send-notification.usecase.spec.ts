/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { NOTIFICATION_SERVICE_TOKEN } from '../domain/constants';
import { SendNotificationUseCase } from './send-notification.usecase';
import { NotificationServicePort } from '../domain/notification.service.port';
import { NotificationDto } from '../presentation/dtos/notification.dto';

describe('SendNotificationUseCase', () => {
  let useCase: SendNotificationUseCase;
  let notifier: jest.Mocked<NotificationServicePort>;

  beforeEach(async () => {
    notifier = { sendNotification: jest.fn().mockResolvedValue(undefined) };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SendNotificationUseCase,
        { provide: NOTIFICATION_SERVICE_TOKEN, useValue: notifier },
      ],
    }).compile();
    useCase = module.get<SendNotificationUseCase>(SendNotificationUseCase);
  });

  it('should call notifier with dto', async () => {
    const dto: NotificationDto = {
      recipientEmail: 'b@example.com',
      subject: 'Test',
      message: 'Body',
    };
    await useCase.execute(dto);
    expect(notifier.sendNotification).toHaveBeenCalledWith(dto);
  });
});
