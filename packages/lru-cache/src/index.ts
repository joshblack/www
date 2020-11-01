export class LRUCache<T> {
  static create<T>(capacity: number): LRUCache<T> {
    return new LRUCache(capacity);
  }

  cache: Map<string, T>;
  capacity: number;

  constructor(capacity: number) {
    this.cache = new Map();
    this.capacity = capacity;
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  get(key: string) {
    const value = this.cache.get(key);
    if (value !== undefined) {
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }

  set(key: string, value: T) {
    this.cache.delete(key);
    this.cache.set(key, value);

    if (this.cache.size > this.capacity) {
      const { done, value } = this.cache.keys().next();
      if (done === false) {
        this.cache.delete(value);
      }
    }
  }

  delete(key: string) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }
}
