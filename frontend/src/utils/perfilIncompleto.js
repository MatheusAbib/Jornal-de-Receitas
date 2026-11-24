export function listarCamposPendentesDoPerfil(usuario) {
  if (!usuario) return [];

  return [
    ['cpf', 'CPF'],
    ['telefone', 'telefone'],
    ['genero', 'gênero'],
  ]
    .filter(([campo]) => !String(usuario[campo] ?? '').trim())
    .map(([, label]) => label);
}