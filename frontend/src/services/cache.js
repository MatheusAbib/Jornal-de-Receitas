const PREFIXO = 'jr_cache_';

export function getCache(chave) {
  try {
    const bruto = localStorage.getItem(PREFIXO + chave);
    return bruto ? JSON.parse(bruto) : null;
  } catch {
    return null;
  }
}

export function setCache(chave, valor) {
  try {
    localStorage.setItem(PREFIXO + chave, JSON.stringify(valor));
  } catch {
  }
}

export function limparCache(chave) {
  try {
    localStorage.removeItem(PREFIXO + chave);
  } catch {
  }
}