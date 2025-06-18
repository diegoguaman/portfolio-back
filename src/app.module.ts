import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { PrismaModule } from 'prisma/prisma.module';
import { FormModule } from './modules/form/form.module';
import * as Joi from 'joi';
import { NotificationModule } from './modules/notification/notification.module';
import { CookieModule } from './modules/cookie/cookie.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      validationSchema: Joi.object({
        TWILIO_ACCOUNT_SID: Joi.string().required(),
        TWILIO_AUTH_TOKEN: Joi.string().required(),
        TWILIO_WHATSAPP_FROM: Joi.string().required(),
        TWILIO_WHATSAPP_TEMPLATE_SID: Joi.string().required(),
      }),
    }),
    NotificationModule,
    PrismaModule,
    FormModule,
    CookieModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
