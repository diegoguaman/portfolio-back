export interface NotificationEntity {
  id: number;
  recipientEmail: string;
  recipientPhone?: string;
  subject: string;
  message: string;
  sentAt: Date;
  channel: 'email' | 'whatsapp';
  status: 'sent' | 'failed';
}
