const cache = new Map();

export function getCache(chave) {
  return cache.get(chave);
}

export function setCache(chave, valor) {
  cache.set(chave, valor);
}