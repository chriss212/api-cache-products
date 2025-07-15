import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    // CacheModule is now global, do not import here
  ],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
