import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chart } from 'primereact/chart';
import AdminLayout from '../../components/AdminLayout/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import usePolling from '../../hooks/usePolling';
import { listarReceitas, listarPendentes, listarRejeitadas } from '../../services/receitaService';
import api from '../../services/api';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const { usuario, carregando: carregandoAuth } = useAuth();

  const [dados, setDados] = useState({
    totalUsuarios: 0,
    usuariosAtivos: 0,
    totalPendentes: 0,
    totalAprovadas: 0,
    totalRejeitadas: 0,
    totalFavoritos: 0,
    topReceitas: []
  });

  const [carregando, setCarregando] = useState(true);
  const chartRef = useRef(null);

  async function carregar(silencioso = false) {
    if (!silencioso) setCarregando(true);

    try {
      const [aprovadas, pendentes, rejeitadas, usuariosResp] = await Promise.all([
        listarReceitas(silencioso),
        listarPendentes(0, 1, '', silencioso),
        listarRejeitadas(0, 1, '', silencioso),
        api.get('/api/usuarios?size=100', { silent: true })
      ]);

      const listaUsuarios = usuariosResp.data.usuarios || [];
      const usuariosAtivos = listaUsuarios.filter(u => u.ativo).length;

      const top = [...aprovadas]
        .sort((a, b) => (b.totalFavoritos || 0) - (a.totalFavoritos || 0))
        .slice(0, 5);

      const totalFavoritos = aprovadas.reduce((acc, r) => acc + (r.totalFavoritos || 0), 0);

      setDados(prev => {
        const novosDados = {
          totalUsuarios: usuariosResp.data.totalItems || listaUsuarios.length,
          usuariosAtivos,
          totalPendentes: pendentes.totalPendentes || 0,
          totalAprovadas: aprovadas.length,
          totalRejeitadas: rejeitadas.totalRejeitadas || 0,
          totalFavoritos,
          topReceitas: top
        };

        const iguais =
          prev.totalUsuarios === novosDados.totalUsuarios &&
          prev.usuariosAtivos === novosDados.usuariosAtivos &&
          prev.totalPendentes === novosDados.totalPendentes &&
          prev.totalAprovadas === novosDados.totalAprovadas &&
          prev.totalRejeitadas === novosDados.totalRejeitadas &&
          prev.totalFavoritos === novosDados.totalFavoritos &&
          JSON.stringify(prev.topReceitas) === JSON.stringify(novosDados.topReceitas);

        return iguais ? prev : novosDados;
      });
    } catch (e) {
      console.error(e);
    } finally {
      if (!silencioso) setCarregando(false);
    }
  }

  useEffect(() => {
    if (carregandoAuth) return;
    if (!usuario) {
      navigate('/');
      return;
    }
    carregar();
  }, [usuario, carregandoAuth, navigate]);

  usePolling(() => carregar(true), 10000, !carregando && !carregandoAuth);

  const statusData = useMemo(() => ({
    labels: ['Pendentes', 'Aprovadas', 'Rejeitadas'],
    datasets: [
      {
        data: [dados.totalPendentes, dados.totalAprovadas, dados.totalRejeitadas],
        backgroundColor: ['#d4af37', '#27ae60', '#8b0000'],
        borderColor: '#fff',
        borderWidth: 2
      }
    ]
  }), [dados.totalPendentes, dados.totalAprovadas, dados.totalRejeitadas]);

  const statusOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#333',
          padding: 15,
          font: { family: 'Inter', size: 13, weight: '600' }
        }
      }
    }
  }), []);

  if (carregandoAuth || carregando) {
    return (
      <AdminLayout>
        <div style={{ paddingTop: '100px', textAlign: 'center' }}>
          <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem', color: '#8b0000' }}></i>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-topbar">
        <h1><i className="pi pi-chart-line"></i> Dashboard</h1>
        <div className="admin-topbar-actions">
          <span><i className="pi pi-calendar"></i> Visão geral do site</span>
        </div>
      </div>

      <div className="dashboard-cards">

        <div className="dashboard-card">
          <div className="card-icon card-icon-users"><i className="pi pi-users"></i></div>
          <div className="card-info">
            <span className="card-label">Total de Usuários</span>
            <span className="card-value">{dados.totalUsuarios}</span>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-icon card-icon-active"><i className="pi pi-user-plus"></i></div>
          <div className="card-info">
            <span className="card-label">Usuários Ativos</span>
            <span className="card-value">{dados.usuariosAtivos}</span>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-icon card-icon-pending"><i className="pi pi-clock"></i></div>
          <div className="card-info">
            <span className="card-label">Receitas Pendentes</span>
            <span className="card-value">{dados.totalPendentes}</span>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-icon card-icon-approved"><i className="pi pi-check-circle"></i></div>
          <div className="card-info">
            <span className="card-label">Receitas Aprovadas</span>
            <span className="card-value">{dados.totalAprovadas}</span>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-icon card-icon-rejected"><i className="pi pi-times-circle"></i></div>
          <div className="card-info">
            <span className="card-label">Receitas Rejeitadas</span>
            <span className="card-value">{dados.totalRejeitadas}</span>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-icon card-icon-fav"><i className="pi pi-heart-fill"></i></div>
          <div className="card-info">
            <span className="card-label">Total de Favoritos</span>
            <span className="card-value">{dados.totalFavoritos}</span>
          </div>
        </div>

      </div>

      <div className="dashboard-grid">

        <div className="dashboard-panel">
          <div className="panel-header">
            <h2><i className="pi pi-chart-pie"></i> Receitas por Status</h2>
          </div>
          <div className="panel-body panel-body-chart">
            <Chart
              ref={chartRef}
              type="doughnut"
              data={statusData}
              options={statusOptions}
            />
          </div>
        </div>

        <div className="dashboard-panel">
          <div className="panel-header">
            <h2><i className="pi pi-star-fill"></i> Top 5 Receitas Mais Favoritadas</h2>
          </div>
          <div className="panel-body panel-body-chart">
            {dados.topReceitas.length > 0 ? (
              <div className="top-list">
                {dados.topReceitas.map((r, i) => {
                  const maxFav = dados.topReceitas[0]?.totalFavoritos || 1;
                  const pct = maxFav > 0 ? (r.totalFavoritos / maxFav) * 100 : 0;

                  return (
                    <div key={i} className="top-item">
                      <span className={`top-rank rank-${i + 1}`}>{i + 1}</span>
                      <div className="top-info">
                        <span className="top-titulo">{r.titulo}</span>
                        <div className="top-bar-bg">
                          <div
                            className="top-bar-fill"
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="top-count">
                        <i className="pi pi-heart-fill"></i> {r.totalFavoritos || 0}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="top-receitas-empty">
                <i className="pi pi-inbox"></i>
                <p>Nenhuma receita aprovada ainda</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}

export default Dashboard;
