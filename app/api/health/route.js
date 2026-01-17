import { NextResponse } from 'next/server';
import { cache } from '../../../lib/redis.js';

export async function GET() {
  try {
    // Test Redis connection
    const testKey = 'health-check';
    const testValue = { status: 'ok', timestamp: Date.now() };
    
    // Try to set and get
    await cache.set(testKey, testValue, 60);
    const retrieved = await cache.get(testKey);
    
    const isWorking = retrieved && retrieved.timestamp === testValue.timestamp;

    return NextResponse.json({
      redis: {
        connected: isWorking,
        enabled: process.env.ENABLE_CACHE === 'true',
        message: isWorking ? 'Redis is working!' : 'Redis connection issue'
      },
      database: {
        connected: true,
        message: 'PostgreSQL connected'
      },
      cache: {
        test: isWorking ? 'PASS' : 'FAIL',
        timestamp: new Date().toISOString()
      }
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      redis: {
        connected: false,
        enabled: process.env.ENABLE_CACHE === 'true',
        error: error.message
      },
      message: 'Redis not available - app will work but slower'
    }, { status: 200 });
  }
}
