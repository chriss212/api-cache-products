import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async findAll() {
    const cacheKey = 'products_all';
    const cached = await this.cacheManager.get(cacheKey);
    console.log('Cache:', cached);
    if (cached) {
      console.log('Desde cache');
      return cached;
    }
    console.log('Desde DB');
    const data = await this.productRepo.find();
    await this.cacheManager.set(cacheKey, data, 30);
    return data;
  }

  async create(data: Partial<Product>) {
    const newProduct = this.productRepo.create(data);
    return this.productRepo.save(newProduct);
  }
}
