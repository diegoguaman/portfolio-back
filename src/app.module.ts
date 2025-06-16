import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { validationSchema } from './config/validation';
import { PrismaModule } from 'prisma/prisma.module';
import { FormModule } from './modules/form/form.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema,
      isGlobal: true,
    }),
    PrismaModule,
    FormModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
