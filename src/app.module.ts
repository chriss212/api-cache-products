import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheConfigService } from './api-cache-error2-src/cache/cache.service';
import { ProductModule } from './api-cache-error2-src/product/product.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '',
      database: 'products_db',
      synchronize: true,
      autoLoadEntities: true,
    }),
    CacheModule.registerAsync({
      useClass: CacheConfigService,
      isGlobal: true,
    }),
    ProductModule
  ],
  providers: [CacheConfigService],
})
export class AppModule {}
