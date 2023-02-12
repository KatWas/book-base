import {
    Module,
    NestModule,
    MiddlewareConsumer,
    RequestMethod,
  } from '@nestjs/common';
  import * as cors from 'cors';
  import { AppController } from './app.controller';
  import { AppService } from './app.service';
import { AuthorsModule } from './src/authors/authors.module';
import { UsersModule } from './src/users/users.module';
import { AuthModuleModule } from './src/auth-module/auth-module.module';
import { PrismaModule } from './src/prisma/prisma.module';
  
  @Module({
    imports: [AuthorsModule, UsersModule, AuthModuleModule, PrismaModule],
    controllers: [AppController],
    providers: [AppService],
  })
  export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
      consumer.apply(cors()).forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      });
    }
  }