import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import usePolling from './usePolling';
import api from '../services/api';

const CHAVE_STORAGE = 'snapshot_notificacoes';

function obterSnapshot() {
  try {
    const raw = sessionStorage.getItem(CHAVE_STORAGE);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function salvarSnapshot(snapshot) {
  try {
    sessionStorage.setItem(CHAVE_STORAGE, JSON.stringify(snapshot));
  } catch (e) {
    console.error(e);
  }
}

function limparSnapshot() {
  sessionStorage.removeItem(CHAVE_STORAGE);
}

function useNotificacoesAutomaticas(ativo = true) {
  const { usuario } = useAuth();
  const { mostrarToast } = useToast();
  const primeiraExecucao = useRef(true);
  const usuarioIdRef = useRef(null);

  useEffect(() => {
    usuarioIdRef.current = usuario?.id || null;

    if (!usuario) {
      limparSnapshot();
      primeiraExecucao.current = true;
    }
  }, [usuario]);

  async function verificar() {
    if (!usuario) return;

    const idNoInicio = usuario.id;

    try {
      const [minhasResp, notifResp] = await Promise.all([
        api.get('/api/receitas/minhas', { silent: true }),
        api.get('/api/notificacoes', { silent: true })
      ]);

      if (usuarioIdRef.current !== idNoInicio) return;

      const todasMinhas = [
        ...(minhasResp.data.pendentes || []),
        ...(minhasResp.data.aprovadas || []),
        ...(minhasResp.data.rejeitadas || [])
      ];

      const receitasAtuais = {};
      todasMinhas.forEach(r => {
        receitasAtuais[r.id] = {
          id: r.id,
          titulo: r.titulo,
          status: r.status,
          motivoRejeicao: r.motivoRejeicao || null
        };
      });

      const notificacoesAtuais = (notifResp.data.notificacoes || []).map(n => ({
        id: n.id,
        mensagem: n.mensagem,
        tipo: n.tipo,
        lida: n.lida
      }));

      const notificacoesIds = notificacoesAtuais.map(n => n.id);

      const snapshot = obterSnapshot();

      if (!snapshot || primeiraExecucao.current) {
        salvarSnapshot({ receitas: receitasAtuais, notificacoesIds });
        primeiraExecucao.current = false;
        return;
      }

      const receitasAntigas = snapshot.receitas || {};
      const notificacoesIdsAntigas = snapshot.notificacoesIds || [];

      const idsAtuais = new Set(Object.keys(receitasAtuais).map(String));

      Object.values(receitasAtuais).forEach(r => {
        const antiga = receitasAntigas[r.id];

        if (!antiga) return;

        if (antiga.status === 'PENDENTE' && r.status === 'APROVADA') {
          mostrarToast(`Sua receita "${r.titulo}" foi aprovada!`, 'success', 'Receita aprovada');
        } else if (antiga.status === 'PENDENTE' && r.status === 'REJEITADA') {
          mostrarToast(
            `Sua receita "${r.titulo}" foi rejeitada.`,
            'warn',
            'Receita rejeitada'
          );
        }
      });

      Object.values(receitasAntigas).forEach(r => {
        if (!idsAtuais.has(String(r.id))) {
          mostrarToast(`Sua receita "${r.titulo}" foi excluída.`, 'info', 'Receita excluída');
        }
      });

      const notificacoesNovas = notificacoesAtuais.filter(
        n => !notificacoesIdsAntigas.includes(n.id)
      );

      notificacoesNovas.forEach(n => {
        if (n.tipo === 'NOVA_RECEITA' && n.mensagem.includes('enviada para aprovação')) return;
        if (n.tipo === 'RECEITA_APROVADA') return;
        if (n.tipo === 'RECEITA_REJEITADA') return;
        if (n.tipo === 'RECEITA_EXCLUIDA') return;
        if (n.tipo === 'FAVORITOU') return;
        if (n.tipo === 'DESFAVORITOU') return;

        mostrarToast(n.mensagem, 'info', 'Nova notificação');
      });

      salvarSnapshot({ receitas: receitasAtuais, notificacoesIds });

    } catch (e) {
      console.error(e);
    }
  }

  usePolling(verificar, 10000, ativo && !!usuario);
}

export default useNotificacoesAutomaticas;
