import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongoModule } from './modules/mongo/mongo.module';
import { CategoriesController } from './modules/categories/categories.controller';
import { CategoriesModule } from './modules/categories/categories.module';
import { FilesystemModule } from './modules/fliesystem/filesystem.module';
import { CDNModule } from './modules/cdn/cdn.module';
import { SubcategoriesModule } from './modules/subcategories/subcategories.module';
import { NewsModule } from './modules/news/news.module';

@Module({
  imports: [MongoModule, CategoriesModule, FilesystemModule, CDNModule, SubcategoriesModule, NewsModule],
  controllers: [CategoriesController],
  providers: [AppService],
})
export class AppModule {}
