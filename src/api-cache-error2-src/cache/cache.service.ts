import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import { Injectable } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  createCacheOptions(): CacheModuleOptions {
    const client = createClient({ socket: { host: 'localhost', port: 6379 } });
    client.connect();

    return {
      store: client as any,
      ttl: 10,
    };
  }
}