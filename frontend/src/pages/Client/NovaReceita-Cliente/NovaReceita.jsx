import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from "../../../components/Global/PageWrapper/PageWrapper";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import { criarReceita } from "../../../services/receitaService";
import { extrairMensagemErro } from "../../../services/api";
import './NovaReceita.css';

const UNIDADES = [
  { value: 'g', label: 'gramas (g)' },
  { value: 'kg', label: 'quilogramas (kg)' },
  { value: 'ml', label: 'mililitros (ml)' },
  { value: 'L', label: 'litros (L)' },
  { value: 'colher (chá)', label: 'colher (chá)' },
  { value: 'colher (sopa)', label: 'colher (sopa)' },
  { value: 'xicara', label: 'xícara (chá)' },
  { value: 'copo', label: 'copo (americano)' },
  { value: 'unidade', label: 'unidade(s)' },
  { value: 'pitada', label: 'pitada' },
  { value: 'fio', label: 'fio' }
];

function limparSufixo(valor) {
  return String(valor || '').replace(/\D/g, '');
}

function NovaReceita() {
  const navigate = useNavigate();
  const { usuario, carregando: carregandoAuth } = useAuth();
  const { mostrarToast } = useToast();

  const [form, setForm] = useState({
    titulo: '',
    chefe: '',
    porcoes: '',
    categoria: ''
  });

  const [modoTempo, setModoTempo] = useState('minutos');
  const [tempoMinutos, setTempoMinutos] = useState('');
  const [tempoHoras, setTempoHoras] = useState('');
  const [tempoMinutosHoras, setTempoMinutosHoras] = useState('');
  const [tempoErro, setTempoErro] = useState('');

  const [ingredientes, setIngredientes] = useState([
    { quantidade: '1', unidade: 'g', nome: '' }
  ]);

  const [modoPreparo, setModoPreparo] = useState(['']);
  const [imagem, setImagem] = useState(null);
  const [preview, setPreview] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (carregandoAuth) return;
    if (!usuario) {
      navigate('/');
      return;
    }
    setForm(f => ({ ...f, chefe: usuario.nome || '' }));
  }, [usuario, carregandoAuth, navigate]);

  useEffect(() => {
    validarTempo();
  }, [modoTempo, tempoMinutos, tempoHoras, tempoMinutosHoras]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function getTempoFormatado() {
    if (modoTempo === 'minutos') {
      const min = parseInt(limparSufixo(tempoMinutos));
      return min > 0 ? `${min}min` : '';
    }
    const h = parseInt(limparSufixo(tempoHoras)) || 0;
    const m = parseInt(limparSufixo(tempoMinutosHoras)) || 0;
    const partes = [];
    if (h > 0) partes.push(`${h}h`);
    if (m > 0) partes.push(`${m}min`);
    return partes.join(' ');
  }

  const tempoFormatado = getTempoFormatado();

  function validarTempo() {
    let msgErro = '';

    if (modoTempo === 'minutos') {
      const min = parseInt(limparSufixo(tempoMinutos));
      if (min && min >= 60) {
        msgErro = 'Use o modo "Horas" para valores acima de 60 minutos.';
      }
    } else {
      const h = parseInt(limparSufixo(tempoHoras)) || 0;
      const m = parseInt(limparSufixo(tempoMinutosHoras)) || 0;

      if (h === 0 && m > 0) {
        msgErro = 'Sem horas? Use o modo "Minutos".';
      } else if (m >= 60) {
        msgErro = 'Os minutos devem ser menores que 60.';
      }
    }

    setTempoErro(msgErro);
    return msgErro === '';
  }

  function toggleModoTempo() {
    if (modoTempo === 'minutos') {
      const min = parseInt(limparSufixo(tempoMinutos));
      if (min > 0) {
        if (min >= 60) {
          const h = Math.floor(min / 60);
          const m = min % 60;
          setTempoHoras(String(h));
          setTempoMinutosHoras(m > 0 ? String(m) : '');
        } else {
          setTempoHoras('');
          setTempoMinutosHoras(String(min));
        }
      }
      setTempoMinutos('');
      setModoTempo('horas');
    } else {
      const h = parseInt(limparSufixo(tempoHoras)) || 0;
      const m = parseInt(limparSufixo(tempoMinutosHoras)) || 0;
      const total = h * 60 + m;

      if (total > 0) setTempoMinutos(String(total));
      setTempoHoras('');
      setTempoMinutosHoras('');
      setModoTempo('minutos');
    }
  }

  function handleTempoMinutosBlur() {
    const min = parseInt(limparSufixo(tempoMinutos), 10) || 0;
    if (min > 0) setTempoMinutos(String(min));
    else setTempoMinutos('');
  }

  function handleTempoHorasBlur() {
    const h = parseInt(limparSufixo(tempoHoras), 10) || 0;
    setTempoHoras(h > 0 ? String(h) : '');
  }

  function handleTempoMinutosHorasBlur() {
    const m = parseInt(limparSufixo(tempoMinutosHoras), 10) || 0;
    setTempoMinutosHoras(m > 0 && m < 60 ? String(m) : '');
  }

  function addIngrediente() {
    setIngredientes([...ingredientes, { quantidade: '', unidade: 'g', nome: '' }]);
  }

  function removeIngrediente(i) {
    if (ingredientes.length === 1) return;
    setIngredientes(ingredientes.filter((_, idx) => idx !== i));
  }

  function updateIngrediente(i, campo, valor) {
    const novo = [...ingredientes];
    novo[i][campo] = valor;
    setIngredientes(novo);
  }

  function addPasso() {
    setModoPreparo([...modoPreparo, '']);
  }

  function removePasso(i) {
    if (modoPreparo.length === 1) return;
    setModoPreparo(modoPreparo.filter((_, idx) => idx !== i));
  }

  function updatePasso(i, valor) {
    const novo = [...modoPreparo];
    novo[i] = valor;
    setModoPreparo(novo);
  }

  function handleRemoverImagem() {
    setImagem(null);
    setPreview('');
  }

  function handleImagem(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImagem(file);
    setPreview(URL.createObjectURL(file));
  }

  const ingredientesValidos = ingredientes.filter(i => i.nome.trim() && i.quantidade);
  const passosValidos = modoPreparo.filter(p => p.trim());

  const formValido =
    form.titulo.trim() &&
    form.chefe.trim() &&
    tempoFormatado &&
    !tempoErro &&
    form.porcoes &&
    Number(form.porcoes) >= 1 &&
    form.categoria &&
    ingredientesValidos.length > 0 &&
    passosValidos.length > 0 &&
    imagem;

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');

    if (!formValido) {
      setErro('Preencha todos os campos obrigatórios');
      mostrarToast('Preencha todos os campos obrigatórios', 'error');
      return;
    }

    setEnviando(true);

    try {
      const formData = new FormData();
      formData.append('titulo', form.titulo);
      formData.append('chefe', form.chefe);
      formData.append('tempoPreparo', tempoFormatado);
      formData.append('porcoes', form.porcoes);
      formData.append('categoria', form.categoria);

      ingredientesValidos.forEach(i => {
        formData.append('ingredientes', `${i.quantidade} ${i.unidade} de ${i.nome}`);
      });

      passosValidos.forEach(p => formData.append('modoPreparo', p));

      if (imagem) formData.append('imagemFile', imagem);

      await criarReceita(formData);
      mostrarToast('Receita enviada para aprovação!', 'success');
      setTimeout(() => navigate('/minhas-receitas'), 1000);
    } catch (err) {
      const msg = extrairMensagemErro(err, 'Erro ao enviar receita. Tente novamente.');
      setErro(msg);
      mostrarToast(msg, 'error');
    } finally {
      setEnviando(false);
    }
  }

  if (carregandoAuth) {
    return <div style={{ paddingTop: '320px', textAlign: 'center' }}>Carregando...</div>;
  }

  return (
    <PageWrapper paginaAtual="nova">
      <main className="nova-main-layout">

        <div className="nova-info-card">
          <div className="nova-info-header">
            <h3><i className="pi pi-lightbulb"></i> Dicas e Informações</h3>
          </div>
          <div className="nova-info-body">

            <div className="nova-info-section">
              <h4><i className="pi pi-info-circle"></i> Como funciona?</h4>
              <p>Após enviar sua receita, ela passará por uma análise do nosso administrador. Você será notificado quando for aprovada ou reprovada.</p>
            </div>

            <div className="nova-info-section">
              <h4><i className="pi pi-check-circle"></i> O que faz uma receita ser aprovada?</h4>
              <ul>
                <li><i className="pi pi-check"></i> Título claro e descritivo</li>
                <li><i className="pi pi-check"></i> Ingredientes com quantidades e unidades corretas</li>
                <li><i className="pi pi-check"></i> Modo de preparo organizado em passos</li>
                <li><i className="pi pi-check"></i> Informação correta de tempo e porções</li>
                <li><i className="pi pi-check"></i> Imagem de qualidade da receita</li>
                <li><i className="pi pi-check"></i> Textos bem escritos e sem erros</li>
              </ul>
            </div>

            <div className="nova-info-section">
              <h4><i className="pi pi-times-circle"></i> O que causa reprovação?</h4>
              <ul>
                <li><i className="pi pi-times"></i> Ingredientes sem quantidade ou unidade</li>
                <li><i className="pi pi-times"></i> Modo de preparo confuso ou incompleto</li>
                <li><i className="pi pi-times"></i> Informações inconsistentes</li>
                <li><i className="pi pi-times"></i> Textos com muitos erros de português</li>
              </ul>
            </div>

            <div className="nova-info-section">
              <h4><i className="pi pi-pencil"></i> Dicas para uma boa receita</h4>
              <div className="nova-info-tip">
                <p><i className="pi pi-check-circle"></i> <strong>Revise antes de enviar!</strong> Verifique se todos os ingredientes estão com quantidade e unidade corretas.</p>
                <p><i className="pi pi-check-circle"></i> <strong>Seja específico</strong> nos passos do preparo.</p>
                <p><i className="pi pi-check-circle"></i> <strong>Use unidades padronizadas</strong> como xícara, colher, gramas.</p>
              </div>
            </div>

          </div>
        </div>

        <div className="nova-form-container">
          <form className="nova-recipe-form" onSubmit={handleSubmit}>

            <div className="nova-form-row">
              <div className="nova-form-group nova-titulo-width">
                <label><i className="pi pi-tag"></i> Título da Receita *</label>
                <input
                  type="text"
                  name="titulo"
                  value={form.titulo}
                  onChange={handleChange}
                  placeholder="Ex: Bolo de Chocolate com Cacau"
                  required
                />
              </div>

              <div className="nova-form-group nova-tempo-width">
                <div className="nova-tempo-label-row">
                  <label><i className="pi pi-clock"></i> Tempo *</label>
                  <button
                    type="button"
                    className="nova-tempo-toggle"
                    onClick={toggleModoTempo}
                    title="Trocar entre minutos e horas"
                  >
                    <i className="pi pi-sync"></i>
                    <span>{modoTempo === 'minutos' ? 'Minutos' : 'Horas'}</span>
                  </button>
                </div>

                {modoTempo === 'minutos' ? (
                  <input
                    type="text"
                    inputMode="numeric"
                    value={tempoMinutos}
                    onChange={(e) => setTempoMinutos(limparSufixo(e.target.value))}
                    onBlur={handleTempoMinutosBlur}
                    placeholder="Ex: 45"
                  />
                ) : (
                  <div className="nova-tempo-horas">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={tempoHoras}
                      onChange={(e) => setTempoHoras(limparSufixo(e.target.value))}
                      onBlur={handleTempoHorasBlur}
                      placeholder="Horas"
                    />
                    <input
                      type="text"
                      inputMode="numeric"
                      value={tempoMinutosHoras}
                      onChange={(e) => setTempoMinutosHoras(limparSufixo(e.target.value))}
                      onBlur={handleTempoMinutosHorasBlur}
                      placeholder="Mins"
                    />
                  </div>
                )}

                {tempoErro && (
                  <div className="nova-tempo-erro">
                    <i className="pi pi-exclamation-circle"></i> {tempoErro}
                  </div>
                )}
              </div>

              <div className="nova-form-group nova-porcoes-width">
                <label><i className="pi pi-users"></i> Porções *</label>
                <input
                  type="number"
                  name="porcoes"
                  value={form.porcoes}
                  onChange={handleChange}
                  placeholder="Ex: 4"
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="nova-form-row">
              <div className="nova-form-group nova-metade-width">
                <label><i className="pi pi-user"></i> Chef *</label>
                <input
                  type="text"
                  name="chefe"
                  value={form.chefe}
                  onChange={handleChange}
                  placeholder="Digite o nome do chef"
                  required
                />
              </div>

              <div className="nova-form-group nova-metade-width">
                <label><i className="pi pi-filter"></i> Categoria *</label>
                <select name="categoria" value={form.categoria} onChange={handleChange} required>
                  <option value="">Selecione uma categoria</option>
                  <option value="SALGADO">Salgado</option>
                  <option value="DOCE">Doce</option>
                </select>
              </div>
            </div>

            <div className="nova-form-group">
              <div className="nova-form-group-header">
                <label><i className="pi pi-list"></i> Ingredientes *</label>
                <button type="button" className="nova-add-btn" onClick={addIngrediente}>
                  <i className="pi pi-plus"></i> Adicionar
                </button>
              </div>

              <div className="nova-ingredientes-container">
                {ingredientes.map((ing, i) => (
                  <div key={i} className="nova-ingrediente-item">
                    <div className="nova-ingrediente-row">
                      <input
                        type="number"
                        className="nova-quantidade"
                        placeholder="Quant."
                        step="0.01"
                        value={ing.quantidade}
                        onChange={(e) => updateIngrediente(i, 'quantidade', e.target.value)}
                      />

                      <select
                        className="nova-unidade"
                        value={ing.unidade}
                        onChange={(e) => updateIngrediente(i, 'unidade', e.target.value)}
                      >
                        {UNIDADES.map(u => (
                          <option key={u.value} value={u.value}>{u.label}</option>
                        ))}
                      </select>

                      <div className="nova-ingrediente-nome-wrapper">
                        <input
                          type="text"
                          className="nova-ingrediente-nome"
                          placeholder="Nome do ingrediente"
                          value={ing.nome}
                          onChange={(e) => updateIngrediente(i, 'nome', e.target.value)}
                        />
                        {ingredientes.length > 1 && (
                          <button
                            type="button"
                            className="nova-remove-btn"
                            onClick={() => removeIngrediente(i)}
                          >
                            <i className="pi pi-times"></i>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="nova-form-group">
              <div className="nova-form-group-header">
                <label><i className="pi pi-book"></i> Modo de Preparo *</label>
                <button type="button" className="nova-add-btn" onClick={addPasso}>
                  <i className="pi pi-plus"></i> Adicionar
                </button>
              </div>

              <div className="nova-passos-container">
                {modoPreparo.map((passo, i) => (
                  <div key={i} className="nova-passo-item">
                    <div className="nova-passo-wrapper">
                      <input
                        type="text"
                        className="nova-passo-input"
                        placeholder={`Passo ${i + 1}`}
                        value={passo}
                        onChange={(e) => updatePasso(i, e.target.value)}
                      />
                      {modoPreparo.length > 1 && (
                        <button
                          type="button"
                          className="nova-remove-btn"
                          onClick={() => removePasso(i)}
                        >
                          <i className="pi pi-times"></i>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="nova-form-group">
              <label><i className="pi pi-image"></i> Imagem da Receita *</label>

              <label className="nova-file-label">
                <span className="nova-file-text">
                  {imagem ? imagem.name : 'Selecione uma imagem para sua receita'}
                </span>
                <span className="nova-file-button">
                  <i className="pi pi-upload"></i>
                </span>
                <input type="file" accept="image/*" onChange={handleImagem} hidden />
              </label>

              {preview && (
                <div className="nova-image-preview">
                  <img src={preview} alt="Preview" />
                  <button
                    type="button"
                    className="nova-image-remove-btn"
                    onClick={handleRemoverImagem}
                    aria-label="Remover imagem"
                  >
                    <i className="pi pi-times"></i>
                  </button>
                </div>
              )}
            </div>

            {erro && (
              <div className="nova-form-erro">
                <i className="pi pi-exclamation-circle"></i> {erro}
              </div>
            )}

            <button
              type="submit"
              className="nova-submit-button"
              disabled={!formValido || enviando}
            >
              {enviando ? (
                <><i className="pi pi-spin pi-spinner"></i> Enviando...</>
              ) : (
                <><i className="pi pi-send"></i> Enviar para aprovação</>
              )}
            </button>

          </form>
        </div>

      </main>
    </PageWrapper>
  );
}

export default NovaReceita;
