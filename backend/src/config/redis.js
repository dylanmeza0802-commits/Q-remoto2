// Cache en memoria simple — reemplaza Redis para desarrollo
const cache = new Map();

const redis = {
  async get(key) {
    return cache.get(key) ?? null;
  },
  async set(key, value) {
    cache.set(key, value);
    return 'OK';
  },
  async setEx(key, ttl, value) {
    cache.set(key, value);
    return 'OK';
  },
  async del(key) {
    cache.delete(key);
    return 1;
  },
  on(event, cb) {
    // no-op, no hay eventos en memoria
  },
  async connect() {
    console.log('[Cache] Usando caché en memoria (sin Redis)');
  },
};

export default redis;