import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product/product.entity';
import { ProductModule } from './product/product.module';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheConfigService } from './cache/cache.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '',
      database: 'products_db',
      entities: [Product],
      synchronize: true,
    }),
    CacheModule.registerAsync({
      isGlobal: true, // Make cache global
      useClass: CacheConfigService,
    }),
    ProductModule,
  ],
})
export class AppModule {}
