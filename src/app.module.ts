import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GuardsProvider } from './providers/guards.provider';
import { FiltersProvider } from './providers/filters.provider';

import { CrawlerModule } from './modules/crawler/crawler.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { LawModule } from './modules/law/law.module';
import { RequestModule } from './modules/request/request.module';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the configuration available globally
    }),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    CrawlerModule,
    AuthModule,
    UserModule,
    LawModule,
    RequestModule,
  ],
  controllers: [AppController],
  providers: [AppService, ...GuardsProvider, ...FiltersProvider],
})
export class AppModule {}
