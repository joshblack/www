import { LRUCache } from '../';

const cache = LRUCache.create(3);

cache.set('a', 1);
cache.set('b', 2);
cache.set('c', 3);

console.log(cache);

cache.set('d', 4);

console.log(cache);
