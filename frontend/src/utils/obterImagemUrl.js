export default function obterImagemUrl(imagem, fallback = '') {
  if (!imagem) return fallback;

  if (/^(https?:\/\/|data:|blob:|\/uploads\/)/.test(imagem)) {
    return imagem;
  }

  return `/uploads/${imagem.replace(/^\/+/, '')}`;
}
