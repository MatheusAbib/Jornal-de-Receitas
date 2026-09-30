const rotas = {
  '/': () => import('../pages/Client/Home-Cliente/Home'),
  '/sobre': () => import('../pages/Client/Sobre-Cliente/Sobre'),
  '/minhas-receitas': () => import('../pages/Client/MinhasReceitas-Cliente/MinhasReceitas'),
  '/nova': () => import('../pages/Client/NovaReceita-Cliente/NovaReceita'),
  '/detalhe': () => import('../pages/Client/DetalhesReceita-Cliente/DetalhesReceita'),
  '/admin/dashboard': () => import('../pages/Admin/Dashboard-Admin/Dashboard'),
  '/admin/usuarios': () => import('../pages/Admin/Usuarios-Admin/Usuarios'),
  '/admin/pendentes': () => import('../pages/Admin/Receitas-Admin/ReceitasPendentes'),
  '/admin/aprovadas': () => import('../pages/Admin/Receitas-Admin/ReceitasAprovadas'),
  '/admin/carrossel': () => import('../pages/Admin/Carrossel-Admin/Carrossel'),
};

const jaBaixados = new Set();

export function prefetchRota(path) {
  const loader = rotas[path];
  if (!loader || jaBaixados.has(path)) return;

  jaBaixados.add(path);
  loader().catch(() => jaBaixados.delete(path));
}