import { Controller, Get, Post, Body, Delete } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Post()
  create(@Body() body) {
    return this.productService.create(body);
  }

  @Delete('cache')
  forceInvalidateCache() {
    return this.productService.forceInvalidateCache();
  }
}
