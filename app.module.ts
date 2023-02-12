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
  
  @Module({
    imports: [AuthorsModule],
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