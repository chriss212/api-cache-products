import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class ProductService {
  private readonly CACHE_KEY = 'products_all';
  private readonly DEFAULT_TTL = 30; // 30 segundos

  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async findAll() {
    try {
      const cached = await this.cacheManager.get(this.CACHE_KEY);
      console.log('Cache value:', cached);

      if (cached) {
        console.log('Retornando desde cache');
        return cached;
      }

      console.log('Consultando desde base de datos');
      const data = await this.productRepo.find();

      // Cache con TTL dinámico basado en la cantidad de productos
      const dynamicTTL = this.calculateDynamicTTL(data.length);
      console.log(
        `Setting cache with key: ${this.CACHE_KEY}, TTL: ${dynamicTTL}`,
      );

      try {
        // For cache-manager v7 and @nestjs/cache-manager v3, TTL must be an object
        // Using type assertion to bypass TypeScript version mismatch
        await (this.cacheManager as any).set(this.CACHE_KEY, data, {
          ttl: dynamicTTL,
        });
        console.log('Cache set successfully');
      } catch (cacheError) {
        console.error('Error setting cache:', cacheError);
      }

      console.log(`Datos cacheados con TTL: ${dynamicTTL} segundos`);
      return data;
    } catch (error) {
      console.error('Error en findAll:', error);
      // Si hay error en cache, devolver desde DB
      return await this.productRepo.find();
    }
  }

  async create(productData: Partial<Product>) {
    try {
      const product = this.productRepo.create(productData);
      const savedProduct = await this.productRepo.save(product);

      // Invalidar caché después de crear nuevo producto (patrón cache-aside)
      await this.invalidateCache();
      console.log('Caché invalidado después de crear producto');

      return savedProduct;
    } catch (error) {
      console.error('Error en create:', error);
      throw error;
    }
  }

  // Método para forzar la invalidación de caché
  async forceInvalidateCache() {
    try {
      await this.cacheManager.del(this.CACHE_KEY);
      console.log('Caché forzadamente invalidado');
      return { message: 'Cache invalidado exitosamente' };
    } catch (error) {
      console.error('Error al invalidar caché:', error);
      throw error;
    }
  }

  // Método privado para invalidar caché
  private async invalidateCache() {
    try {
      await this.cacheManager.del(this.CACHE_KEY);
    } catch (error) {
      console.error('Error al invalidar caché:', error);
    }
  }

  // TTL dinámico basado en la cantidad de productos
  private calculateDynamicTTL(productCount: number): number {
    if (productCount === 0) {
      return 10; // TTL más corto si no hay productos
    } else if (productCount < 10) {
      return 60; // TTL más largo para pocos productos
    } else if (productCount < 50) {
      return 30; // TTL estándar
    } else {
      return 15; // TTL más corto para muchos productos
    }
  }
}
