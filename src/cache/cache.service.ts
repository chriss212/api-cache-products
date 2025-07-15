import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  createCacheOptions(): CacheModuleOptions {
    try {
      const options = {
        ttl: 30, // 30 segundos
        max: 100, // máximo 100 items en cache
      };
      console.log('In-memory cache config being used:', options);
      return options;
    } catch (error) {
      console.error('Error in CacheConfigService:', error);
      throw error;
    }
  }
}
