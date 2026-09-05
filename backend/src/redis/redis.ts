import { createClient, RedisClientType } from 'redis';
import { ENV } from '../config/env';

export class Pubsub {
  private static instance: Pubsub;
  private client: RedisClientType;
  private isConnected: boolean = false;

  private constructor() {
    this.client = createClient({
      url: ENV.REDIS_URL,
    });

    this.client.on('error', (err) => {
      console.warn('[Redis] Connection warning (running in degraded cache mode):', err.message);
      this.isConnected = false;
    });

    this.client.on('connect', () => {
      console.log('[Redis] Connected successfully to Redis server');
      this.isConnected = true;
    });

    this.client.connect().catch((err) => {
      console.warn('[Redis] Initial connection failed. In-memory cache will be used.', err.message);
    });
  }

  public static getInstance(): Pubsub {
    if (!Pubsub.instance) {
      Pubsub.instance = new Pubsub();
    }
    return Pubsub.instance;
  }

  public getClient(): RedisClientType {
    return this.client;
  }
}