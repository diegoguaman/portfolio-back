import { NotificationDto } from '../presentation/dtos/notification.dto';

export interface NotificationServicePort {
  sendNotification(dto: NotificationDto): Promise<void>;
}
