import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { PrismaModule } from './../prisma/prisma.module';
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
        PORT: Joi.number().default(3000),
        DATABASE_URL: Joi.string().uri().required(),
        JWT_SECRET: Joi.string().min(8).default('dummy-secret-for-tests'),
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
