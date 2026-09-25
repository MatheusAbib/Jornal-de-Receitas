const cache = new Map();
const rotasVisitadas = new Set();

export function getCache(chave) {
  return cache.get(chave);
}

export function setCache(chave, valor) {
  cache.set(chave, valor);
}

export function limparCache(chave) {
  if (chave) cache.delete(chave);
  else cache.clear();
}

export function rotaJaVisitada(rota) {
  return rotasVisitadas.has(rota);
}

export function marcarRotaVisitada(rota) {
  rotasVisitadas.add(rota);
}

export function limparRotasVisitadas() {
  rotasVisitadas.clear();
}

export function limparTudo() {
  cache.clear();
  rotasVisitadas.clear();
}
