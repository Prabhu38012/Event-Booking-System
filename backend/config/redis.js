import { createClient } from 'redis';

let redisClient = null;

export const connectRedis = async () => {
  if (!process.env.REDIS_HOST) {
    console.log('⚠️  Redis not configured, skipping connection');
    return null;
  }

  try {
    redisClient = createClient({
      socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT || 6379
      },
      password: process.env.REDIS_PASSWORD || undefined
    });

    redisClient.on('error', (err) => console.error('Redis Client Error', err));
    
    await redisClient.connect();
    console.log('✅ Redis Connected');
    
    return redisClient;
  } catch (error) {
    console.error('❌ Redis Connection Error:', error.message);
    return null;
  }
};

export const getRedisClient = () => redisClient;

// Seat locking helpers
export const lockSeat = async (eventId, userId, numberOfSeats) => {
  if (!redisClient) return false;
  
  const key = `seat_lock:${eventId}:${userId}`;
  await redisClient.setEx(key, 600, numberOfSeats.toString()); // 10 minutes
  return true;
};

export const unlockSeat = async (eventId, userId) => {
  if (!redisClient) return false;
  
  const key = `seat_lock:${eventId}:${userId}`;
  await redisClient.del(key);
  return true;
};

export const getSeatLock = async (eventId, userId) => {
  if (!redisClient) return null;
  
  const key = `seat_lock:${eventId}:${userId}`;
  return await redisClient.get(key);
};
