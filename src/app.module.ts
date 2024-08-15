import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CrawlerModule } from './modules/crawler/crawler.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { GuardsProvider } from './providers/guards.provider';
import { FiltersProvider } from './providers/filters.provider';
import { LawModule } from './modules/law/law.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://devtest:dev123@law.tfz4t8e.mongodb.net/?retryWrites=true&w=majority&appName=Law',
    ),
    CrawlerModule,
    AuthModule,
    UserModule,
    LawModule,
  ],
  controllers: [AppController],
  providers: [AppService, ...GuardsProvider, ...FiltersProvider],
})
export class AppModule {}
