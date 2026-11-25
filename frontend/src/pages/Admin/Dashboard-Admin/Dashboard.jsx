import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chart } from 'primereact/chart';
import AdminLayout from '../../../components/Admin/AdminLayout/AdminLayout';
import { useAuth } from '../../../context/AuthContext';
import usePolling from '../../../hooks/usePolling';
import {
  listarReceitas,
  listarPendentes,
  listarRejeitadas
} from '../../../services/receitaService';
import api from '../../../services/api';
import { getCache, setCache } from '../../../services/cache';
import './Dashboard.css';

const CACHE_KEY = 'admin-dashboard';

const dadosIniciais = {
  totalUsuarios: 0,
  usuariosAtivos: 0,
  totalPendentes: 0,
  totalAprovadas: 0,
  totalRejeitadas: 0,
  totalFavoritos: 0,
  topReceitas: []
};

const indicadores = [
  { campo: 'totalUsuarios', titulo: 'Usuários cadastrados', icone: 'pi-users', cor: 'verde' },
  { campo: 'usuariosAtivos', titulo: 'Usuários ativos', icone: 'pi-user-plus', cor: 'verde' },
  { campo: 'totalPendentes', titulo: 'Receitas pendentes', icone: 'pi-clock', cor: 'ocre' },
  { campo: 'totalAprovadas', titulo: 'Receitas aprovadas', icone: 'pi-check-circle', cor: 'verde' },
  { campo: 'totalRejeitadas', titulo: 'Receitas rejeitadas', icone: 'pi-times-circle', cor: 'vermelho' },
  { campo: 'totalFavoritos', titulo: 'Favoritos', icone: 'pi-heart', cor: 'vermelho' }
];

const status = [
  { campo: 'totalPendentes', titulo: 'Pendentes', cor: '#a87d2d' },
  { campo: 'totalAprovadas', titulo: 'Aprovadas', cor: '#526b50' },
  { campo: 'totalRejeitadas', titulo: 'Rejeitadas', cor: '#a13f35' }
];

const opcoesGrafico = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  cutout: '68%',
  plugins: {
    legend: { display: false }
  }
};

const formatarNumero = new Intl.NumberFormat('pt-BR');

function Dashboard() {
  const navigate = useNavigate();
  const { usuario, carregando: carregandoAuth } = useAuth();
  const [dados, setDados] = useState(dadosIniciais);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const ehAdmin = usuario?.role === 'ADMIN';
  const carregandoTela = carregandoAuth || carregando;

  async function carregar(silencioso = false) {
    if (!silencioso) setCarregando(true);

    try {
      const [aprovadas, pendentes, rejeitadas, usuariosResp] = await Promise.all([
        listarReceitas(silencioso),
        listarPendentes(0, 1, '', silencioso),
        listarRejeitadas(0, 1, '', silencioso),
        api.get('/api/usuarios?size=100', { silent: true })
      ]);

      const listaUsuarios = usuariosResp.data.usuarios ?? [];
      const topReceitas = [...aprovadas]
        .sort((a, b) => (b.totalFavoritos || 0) - (a.totalFavoritos || 0))
        .slice(0, 5);

      const novosDados = {
        totalUsuarios: usuariosResp.data.totalItems ?? listaUsuarios.length,
        usuariosAtivos: listaUsuarios.filter(item => item.ativo).length,
        totalPendentes: pendentes.totalPendentes ?? 0,
        totalAprovadas: aprovadas.length,
        totalRejeitadas: rejeitadas.totalRejeitadas ?? 0,
        totalFavoritos: aprovadas.reduce(
          (total, receita) => total + (receita.totalFavoritos || 0),
          0
        ),
        topReceitas
      };

      setCache(CACHE_KEY, novosDados);
      setDados(novosDados);
      setErro('');
    } catch (falha) {
      console.error(falha);
      setErro('Não foi possível atualizar os dados do painel.');
    } finally {
      if (!silencioso) setCarregando(false);
    }
  }

  useEffect(() => {
    if (carregandoAuth) return;

    if (!ehAdmin) {
      navigate('/', { replace: true });
      return;
    }

    const cache = getCache(CACHE_KEY);

    if (cache) {
      setDados(cache);
      setCarregando(false);
      carregar(true);
    } else {
      carregar();
    }
  }, [usuario, ehAdmin, carregandoAuth, navigate]);

  usePolling(() => carregar(true), 10000, ehAdmin && !carregandoTela);

  const { totalPendentes, totalAprovadas, totalRejeitadas } = dados;

  const dadosGrafico = useMemo(() => ({
    labels: status.map(item => item.titulo),
    datasets: [{
      data: [totalPendentes, totalAprovadas, totalRejeitadas],
      backgroundColor: status.map(item => item.cor),
      borderWidth: 0
    }]
  }), [totalPendentes, totalAprovadas, totalRejeitadas]);

  const totalReceitas = totalPendentes + totalAprovadas + totalRejeitadas;
  const maxFavoritos = dados.topReceitas[0]?.totalFavoritos || 1;

  if (!carregandoAuth && !ehAdmin) return null;

  return (
    <AdminLayout
  titulo="Dashboard"
  descricao="Acompanhe os usuários, as receitas e os favoritos do Jornal."
>
      <div className="admin-dashboard">

        {erro && (
          <p className="dashboard-aviso" role="status">
            <i className="pi pi-exclamation-circle" aria-hidden="true" />
            {erro}
          </p>
        )}

        <div aria-busy={carregandoTela}>
          <section className="dashboard-cards" aria-label="Indicadores do Jornal">
            {indicadores.map(({ campo, titulo, icone, cor }) => (
              <div className="dashboard-card" key={campo}>
                <span className={`dashboard-icone dashboard-icone--${cor}`}>
                  <i className={`pi ${icone}`} aria-hidden="true" />
                </span>

                <div className="dashboard-indicador">
                  <span className="dashboard-rotulo">{titulo}</span>
                  {carregandoTela ? (
                    <span className="dashboard-skeleton dashboard-skeleton--valor" aria-hidden="true" />
                  ) : (
                    <strong className="dashboard-valor">
                      {formatarNumero.format(dados[campo])}
                    </strong>
                  )}
                </div>
              </div>
            ))}
          </section>

          <div className="dashboard-grid">
            <section className="dashboard-panel" aria-labelledby="dashboard-status">
              <header className="dashboard-panel-header">
                <h2 id="dashboard-status">
                  <i className="pi pi-chart-pie" aria-hidden="true" />
                  Receitas por status
                </h2>
              </header>

              <div className="dashboard-panel-body">
                <div className="dashboard-grafico-area" aria-hidden="true">
                  {carregandoTela ? (
                    <div className="dashboard-skeleton dashboard-skeleton--grafico" />
                  ) : totalReceitas > 0 ? (
                    <Chart
                      type="doughnut"
                      data={dadosGrafico}
                      options={opcoesGrafico}
                      className="dashboard-grafico"
                    />
                  ) : (
                    <i className="pi pi-chart-pie dashboard-grafico-vazio" />
                  )}
                </div>

                {!carregandoTela && (
                  <ul className="dashboard-legenda" aria-label="Totais por status">
                    {status.map(({ campo, titulo, cor }) => (
                      <li key={campo}>
                        <span className="dashboard-legenda-cor" style={{ backgroundColor: cor }} aria-hidden="true" />
                        <span>{titulo}</span>
                        <strong>{formatarNumero.format(dados[campo])}</strong>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>

            <section className="dashboard-panel" aria-labelledby="dashboard-favoritas">
              <header className="dashboard-panel-header">
                <h2 id="dashboard-favoritas">
                  <i className="pi pi-heart" aria-hidden="true" />
                  Receitas mais favoritadas
                </h2>
              </header>

              <div className="dashboard-panel-body">
                {carregandoTela ? (
                  <div className="dashboard-ranking" aria-hidden="true">
                    {Array.from({ length: 5 }, (_, indice) => (
                      <div className="dashboard-skeleton dashboard-skeleton--linha" key={indice} />
                    ))}
                  </div>
                ) : dados.topReceitas.length > 0 ? (
                  <ol className="dashboard-ranking">
                    {dados.topReceitas.map((receita, indice) => {
                      const favoritos = receita.totalFavoritos || 0;

                      return (
                        <li className="dashboard-ranking-item" key={receita.id}>
                          <span className="dashboard-posicao" aria-hidden="true">
                            {indice + 1}
                          </span>

                          <div className="dashboard-ranking-info">
                            <span className="dashboard-receita-titulo">{receita.titulo}</span>
                            <div className="dashboard-barra" aria-hidden="true">
                              <div style={{ width: `${(favoritos / maxFavoritos) * 100}%` }} />
                            </div>
                          </div>

                          <span className="dashboard-favoritos" aria-label={`${favoritos} favoritos`}>
                            <i className="pi pi-heart-fill" aria-hidden="true" />
                            {formatarNumero.format(favoritos)}
                          </span>
                        </li>
                      );
                    })}
                  </ol>
                ) : (
                  <p className="dashboard-vazio">
                    <i className="pi pi-inbox" aria-hidden="true" />
                    Nenhuma receita aprovada ainda.
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Dashboard;