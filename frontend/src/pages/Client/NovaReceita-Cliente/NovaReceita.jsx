import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../../components/Global/PageWrapper/PageWrapper';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { criarReceita } from '../../../services/receitaService';
import { extrairMensagemErro } from '../../../services/api';
import { prefetchRota } from '../../../services/prefetch';
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

  const inputImagemRef = useRef(null);

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

    setForm(prev => ({
      ...prev,
      chefe: prev.chefe || usuario.nome || ''
    }));
  }, [usuario, carregandoAuth, navigate]);

  useEffect(() => {
    if (!imagem) {
      setPreview('');
      return;
    }

    const url = URL.createObjectURL(imagem);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [imagem]);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));

    if (erro) setErro('');
  }

  function getTempoFormatado() {
    if (modoTempo === 'minutos') {
      const min = parseInt(limparSufixo(tempoMinutos), 10);
      return min > 0 ? `${min}min` : '';
    }

    const h = parseInt(limparSufixo(tempoHoras), 10) || 0;
    const m = parseInt(limparSufixo(tempoMinutosHoras), 10) || 0;
    const partes = [];

    if (h > 0) partes.push(`${h}h`);
    if (m > 0) partes.push(`${m}min`);

    return partes.join(' ');
  }

  const tempoFormatado = getTempoFormatado();

  function getTempoErro() {
    if (modoTempo === 'minutos') {
      const min = parseInt(limparSufixo(tempoMinutos), 10);

      if (min >= 60) {
        return 'Para tempos de 60 minutos ou mais, utilize o modo Horas.';
      }

      return '';
    }

    const h = parseInt(limparSufixo(tempoHoras), 10) || 0;
    const m = parseInt(limparSufixo(tempoMinutosHoras), 10) || 0;

    if (m >= 60) {
      return 'Os minutos devem ser menores que 60.';
    }

    if (h === 0 && m > 0) {
      return 'Sem horas? Utilize o modo Minutos.';
    }

    return '';
  }

  const tempoErro = getTempoErro();

  function toggleModoTempo() {
    if (modoTempo === 'minutos') {
      const min = parseInt(limparSufixo(tempoMinutos), 10) || 0;

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
      } else {
        setTempoHoras('');
        setTempoMinutosHoras('');
      }

      setTempoMinutos('');
      setModoTempo('horas');
    } else {
      const h = parseInt(limparSufixo(tempoHoras), 10) || 0;
      const m = parseInt(limparSufixo(tempoMinutosHoras), 10) || 0;
      const total = h * 60 + m;

      setTempoMinutos(total > 0 ? String(total) : '');
      setTempoHoras('');
      setTempoMinutosHoras('');
      setModoTempo('minutos');
    }
  }

  function handleTempoMinutosBlur() {
    const min = parseInt(limparSufixo(tempoMinutos), 10) || 0;
    setTempoMinutos(min > 0 ? String(min) : '');
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
    setIngredientes(prev => [
      ...prev,
      { quantidade: '', unidade: 'g', nome: '' }
    ]);
  }

  function removeIngrediente(index) {
    setIngredientes(prev =>
      prev.length > 1
        ? prev.filter((_, i) => i !== index)
        : prev
    );
  }

  function updateIngrediente(index, campo, valor) {
    setIngredientes(prev =>
      prev.map((ingrediente, i) =>
        i === index
          ? { ...ingrediente, [campo]: valor }
          : ingrediente
      )
    );
  }

  function addPasso() {
    setModoPreparo(prev => [...prev, '']);
  }

  function removePasso(index) {
    setModoPreparo(prev =>
      prev.length > 1
        ? prev.filter((_, i) => i !== index)
        : prev
    );
  }

  function updatePasso(index, valor) {
    setModoPreparo(prev =>
      prev.map((passo, i) => i === index ? valor : passo)
    );
  }

  function handleImagem(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      mostrarToast('Selecione um arquivo de imagem válido.', 'error');
      e.target.value = '';
      return;
    }

    setImagem(file);
    setErro('');
  }

  function handleRemoverImagem() {
    setImagem(null);

    if (inputImagemRef.current) {
      inputImagemRef.current.value = '';
    }
  }

  const ingredientesValidos = ingredientes.filter(
    item =>
      item.nome.trim() &&
      item.quantidade !== '' &&
      Number(item.quantidade) > 0
  );

  const passosValidos = modoPreparo.filter(passo => passo.trim());

  const formValido = Boolean(
    form.titulo.trim() &&
    form.chefe.trim() &&
    tempoFormatado &&
    !tempoErro &&
    form.porcoes &&
    Number(form.porcoes) >= 1 &&
    form.categoria &&
    ingredientesValidos.length > 0 &&
    passosValidos.length > 0 &&
    imagem
  );

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');

    if (!formValido || enviando) {
      if (!enviando) {
        const mensagem = 'Preencha todos os campos obrigatórios.';
        setErro(mensagem);
        mostrarToast(mensagem, 'error');
      }

      return;
    }

    setEnviando(true);

    try {
      const formData = new FormData();

      formData.append('titulo', form.titulo.trim());
      formData.append('chefe', form.chefe.trim());
      formData.append('tempoPreparo', tempoFormatado);
      formData.append('porcoes', form.porcoes);
      formData.append('categoria', form.categoria);

      ingredientesValidos.forEach(item => {
        formData.append(
          'ingredientes',
          `${item.quantidade} ${item.unidade} de ${item.nome.trim()}`
        );
      });

      passosValidos.forEach(passo => {
        formData.append('modoPreparo', passo.trim());
      });

      formData.append('imagemFile', imagem);

      await criarReceita(formData);

      mostrarToast('Receita enviada para aprovação!', 'success');

      prefetchRota('/minhas-receitas');

      setTimeout(() => {
        navigate('/minhas-receitas');
      }, 1000);
    } catch (err) {
      const mensagem = extrairMensagemErro(
        err,
        'Erro ao enviar receita. Tente novamente.'
      );

      setErro(mensagem);
      mostrarToast(mensagem, 'error');
      setEnviando(false);
    }
  }

  if (carregandoAuth) {
    return (
      <PageWrapper paginaAtual="nova">
        <div className="nova-auth-loading" role="status">
          <i className="pi pi-spin pi-spinner" aria-hidden="true"></i>
          <span>Carregando formulário...</span>
        </div>
      </PageWrapper>
    );
  }

  if (!usuario) return null;

  return (
    <PageWrapper paginaAtual="nova">
      <main className="nova-page">
        <header className="nova-page-header">
          <div className="nova-page-header-top">
            <span>Jornal de Receitas</span>
            <span>Colabore com o jornal</span>
          </div>

          <div className="nova-page-header-content">
            <span className="nova-eyebrow">Compartilhe sua receita</span>

            <h1>Enviar uma receita</h1>

            <p>
              Preencha as informações abaixo para compartilhar sua
              preparação. Sua receita será analisada antes da publicação.
            </p>

            <button
              type="button"
              className="minhas-nova-btn"
              onClick={() => navigate('/minhas-receitas')}
            >
              <i className="pi pi-eye" aria-hidden="true"></i>
              Minhas Receitas
            </button>
          </div>

          <div className="nova-page-header-bottom">
            <span>
              <i className="pi pi-list-check" aria-hidden="true"></i>
              Preencha as quatro etapas
            </span>

            <span>
              <i className="pi pi-shield" aria-hidden="true"></i>
              Publicação sujeita à aprovação
            </span>
          </div>
        </header>

        <div className="nova-main-layout">
          <div className="nova-form-container">
            <form className="nova-recipe-form" onSubmit={handleSubmit}>
              <section className="nova-form-section">
                <div className="nova-step-header">
                  <span className="nova-step-number">01</span>

                  <div className="nova-step-heading">
                    <h2>Informações da receita</h2>
                    <p>
                      Comece identificando sua receita e informando
                      o tempo necessário para prepará-la.
                    </p>
                  </div>
                </div>

                <div className="nova-form-fields">
                  <div className="nova-form-row">
                    <div className="nova-form-group nova-titulo-width">
                      <label htmlFor="nova-titulo">
                        <i className="pi pi-tag" aria-hidden="true"></i>
                        Título da receita <span>*</span>
                      </label>

                      <input
                        id="nova-titulo"
                        type="text"
                        name="titulo"
                        value={form.titulo}
                        onChange={handleChange}
                        placeholder="Ex.: Bolo de chocolate com cacau"
                        autoComplete="off"
                        required
                      />
                    </div>

                    <div className="nova-form-group nova-tempo-width">
                      <div className="nova-tempo-label-row">
                        <label htmlFor="nova-tempo">
                          <i className="pi pi-clock" aria-hidden="true"></i>
                          Tempo <span>*</span>
                        </label>

                        <button
                          type="button"
                          className="nova-tempo-toggle"
                          onClick={toggleModoTempo}
                          title="Alternar entre minutos e horas"
                          aria-label={`Modo atual: ${modoTempo}. Alternar unidade de tempo`}
                        >
                          <i className="pi pi-sync" aria-hidden="true"></i>
                          {modoTempo === 'minutos' ? 'Minutos' : 'Horas'}
                        </button>
                      </div>

                      {modoTempo === 'minutos' ? (
                        <input
                          id="nova-tempo"
                          type="text"
                          inputMode="numeric"
                          value={tempoMinutos}
                          onChange={e =>
                            setTempoMinutos(limparSufixo(e.target.value))
                          }
                          onBlur={handleTempoMinutosBlur}
                          placeholder="Ex.: 45"
                          aria-invalid={Boolean(tempoErro)}
                          aria-describedby="nova-tempo-ajuda"
                        />
                      ) : (
                        <div className="nova-tempo-horas">
                          <input
                            id="nova-tempo"
                            type="text"
                            inputMode="numeric"
                            value={tempoHoras}
                            onChange={e =>
                              setTempoHoras(limparSufixo(e.target.value))
                            }
                            onBlur={handleTempoHorasBlur}
                            placeholder="Horas"
                            aria-label="Quantidade de horas"
                            aria-invalid={Boolean(tempoErro)}
                          />

                          <input
                            type="text"
                            inputMode="numeric"
                            value={tempoMinutosHoras}
                            onChange={e =>
                              setTempoMinutosHoras(limparSufixo(e.target.value))
                            }
                            onBlur={handleTempoMinutosHorasBlur}
                            placeholder="Mins"
                            aria-label="Minutos adicionais"
                            aria-invalid={Boolean(tempoErro)}
                          />
                        </div>
                      )}

                      {tempoErro && (
                        <div className="nova-tempo-erro" role="alert">
                          <i
                            className="pi pi-exclamation-circle"
                            aria-hidden="true"
                          ></i>
                          {tempoErro}
                        </div>
                      )}
                    </div>

                    <div className="nova-form-group nova-porcoes-width">
                      <label htmlFor="nova-porcoes">
                        <i className="pi pi-users" aria-hidden="true"></i>
                        Porções <span>*</span>
                      </label>

                      <input
                        id="nova-porcoes"
                        type="number"
                        name="porcoes"
                        value={form.porcoes}
                        onChange={handleChange}
                        placeholder="Ex.: 4"
                        min="1"
                        step="1"
                        required
                      />
                    </div>
                  </div>

                  <div className="nova-form-row">
                    <div className="nova-form-group nova-metade-width">
                      <label htmlFor="nova-chefe">
                        <i className="pi pi-user" aria-hidden="true"></i>
                        Chef <span>*</span>
                      </label>

                      <input
                        id="nova-chefe"
                        type="text"
                        name="chefe"
                        value={form.chefe}
                        onChange={handleChange}
                        placeholder="Nome do responsável"
                        required
                      />
                    </div>

                    <div className="nova-form-group nova-metade-width">
                      <label htmlFor="nova-categoria">
                        <i className="pi pi-filter" aria-hidden="true"></i>
                        Categoria <span>*</span>
                      </label>

                      <select
                        id="nova-categoria"
                        name="categoria"
                        value={form.categoria}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Selecione uma categoria</option>
                        <option value="SALGADO">Salgado</option>
                        <option value="DOCE">Doce</option>
                      </select>
                    </div>
                  </div>

                  <p className="nova-field-hint" id="nova-tempo-ajuda">
                    <i className="pi pi-info-circle" aria-hidden="true"></i>
                    Informe o tempo total de preparo, incluindo o cozimento.
                  </p>
                </div>
              </section>

              <section className="nova-form-section">
                <div className="nova-step-header">
                  <span className="nova-step-number">02</span>

                  <div className="nova-step-heading">
                    <h2>Ingredientes</h2>
                    <p>
                      Informe cada ingrediente separadamente, com sua
                      quantidade e unidade de medida.
                    </p>
                  </div>
                </div>

                <div className="nova-form-fields">
                  <div className="nova-ingredientes-container">
                    {ingredientes.map((ing, index) => (
                      <div
                        className="nova-ingrediente-item"
                        key={index}
                      >
                        <div className="nova-item-heading">
                          <span>
                            Ingrediente {String(index + 1).padStart(2, '0')}
                          </span>
                        </div>

                        <div className="nova-ingrediente-row">
                          <div className="nova-item-field">
                            <label htmlFor={`nova-quantidade-${index}`}>
                              Quantidade
                            </label>

                            <input
                              id={`nova-quantidade-${index}`}
                              type="number"
                              className="nova-quantidade"
                              placeholder="Ex.: 200"
                              min="0.01"
                              step="0.01"
                              value={ing.quantidade}
                              onChange={e =>
                                updateIngrediente(
                                  index,
                                  'quantidade',
                                  e.target.value
                                )
                              }
                            />
                          </div>

                          <div className="nova-item-field">
                            <label htmlFor={`nova-unidade-${index}`}>
                              Unidade
                            </label>

                            <select
                              id={`nova-unidade-${index}`}
                              className="nova-unidade"
                              value={ing.unidade}
                              onChange={e =>
                                updateIngrediente(
                                  index,
                                  'unidade',
                                  e.target.value
                                )
                              }
                            >
                              {UNIDADES.map(unidade => (
                                <option
                                  key={unidade.value}
                                  value={unidade.value}
                                >
                                  {unidade.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="nova-item-field">
                            <label htmlFor={`nova-ingrediente-${index}`}>
                              Ingrediente
                            </label>

                            <div className="nova-ingrediente-nome-wrapper">
                              <input
                                id={`nova-ingrediente-${index}`}
                                type="text"
                                className="nova-ingrediente-nome"
                                placeholder="Ex.: Farinha de trigo"
                                value={ing.nome}
                                onChange={e =>
                                  updateIngrediente(
                                    index,
                                    'nome',
                                    e.target.value
                                  )
                                }
                              />

                              {ingredientes.length > 1 && (
                                <button
                                  type="button"
                                  className="nova-remove-btn"
                                  onClick={() => removeIngrediente(index)}
                                  aria-label={`Remover ingrediente ${index + 1}`}
                                  title="Remover ingrediente"
                                >
                                  <i
                                    className="pi pi-trash"
                                    aria-hidden="true"
                                  ></i>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="nova-add-btn"
                    onClick={addIngrediente}
                  >
                    <i className="pi pi-plus" aria-hidden="true"></i>
                    Adicionar ingrediente
                  </button>

                  <p className="nova-field-hint">
                    <i className="pi pi-info-circle" aria-hidden="true"></i>
                    Exemplo: 200 gramas de farinha de trigo. Use o botão
                    acima para incluir todos os ingredientes.
                  </p>
                </div>
              </section>

              <section className="nova-form-section">
                <div className="nova-step-header">
                  <span className="nova-step-number">03</span>

                  <div className="nova-step-heading">
                    <h2>Modo de preparo</h2>
                    <p>
                      Descreva o preparo em etapas, na ordem em que
                      devem ser realizadas.
                    </p>
                  </div>
                </div>

                <div className="nova-form-fields">
                  <div className="nova-passos-container">
                    {modoPreparo.map((passo, index) => (
                      <div className="nova-passo-item" key={index}>
                        <div className="nova-passo-identificacao">
                          <span>{String(index + 1).padStart(2, '0')}</span>
                        </div>

                        <div className="nova-passo-conteudo">
                          <label htmlFor={`nova-passo-${index}`}>
                            Passo {index + 1}
                          </label>

                          <div className="nova-passo-wrapper">
                            <textarea
                              id={`nova-passo-${index}`}
                              className="nova-passo-input"
                              placeholder={
                                index === 0
                                  ? 'Ex.: Em uma tigela, misture os ingredientes secos...'
                                  : 'Descreva a próxima etapa do preparo...'
                              }
                              value={passo}
                              onChange={e =>
                                updatePasso(index, e.target.value)
                              }
                              rows="2"
                            />

                            {modoPreparo.length > 1 && (
                              <button
                                type="button"
                                className="nova-remove-btn"
                                onClick={() => removePasso(index)}
                                aria-label={`Remover passo ${index + 1}`}
                                title="Remover passo"
                              >
                                <i
                                  className="pi pi-trash"
                                  aria-hidden="true"
                                ></i>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="nova-add-btn"
                    onClick={addPasso}
                  >
                    <i className="pi pi-plus" aria-hidden="true"></i>
                    Adicionar passo
                  </button>

                  <p className="nova-field-hint">
                    <i className="pi pi-info-circle" aria-hidden="true"></i>
                    Escreva uma ação por etapa. Inclua temperaturas,
                    tempos de forno e outros detalhes importantes.
                  </p>
                </div>
              </section>

              <section className="nova-form-section nova-form-section-last">
                <div className="nova-step-header">
                  <span className="nova-step-number">04</span>

                  <div className="nova-step-heading">
                    <h2>Imagem da receita</h2>
                    <p>
                      Escolha uma fotografia que mostre o resultado
                      da preparação.
                    </p>
                  </div>
                </div>

                <div className="nova-form-fields">
                  <label
                    className={`nova-file-label ${imagem ? 'nova-file-selected' : ''}`}
                    htmlFor="nova-imagem"
                  >
                    <span className="nova-file-button">
                      <i
                        className={imagem ? 'pi pi-check' : 'pi pi-image'}
                        aria-hidden="true"
                      ></i>
                    </span>

                    <span className="nova-file-info">
                      <strong>
                        {imagem ? 'Imagem selecionada' : 'Selecionar imagem'}
                      </strong>

                      <span className="nova-file-text">
                        {imagem
                          ? imagem.name
                          : 'Clique para escolher uma imagem do seu dispositivo'}
                      </span>
                    </span>

                    <span className="nova-file-action">
                      <i className="pi pi-upload" aria-hidden="true"></i>
                    </span>
                  </label>

                  <input
                    id="nova-imagem"
                    ref={inputImagemRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImagem}
                    className="nova-file-input"
                  />

                  {preview && (
                    <div className="nova-image-preview">
                      <img
                        src={preview}
                        alt="Prévia da imagem selecionada para a receita"
                      />

                      <button
                        type="button"
                        className="nova-image-remove-btn"
                        onClick={handleRemoverImagem}
                        aria-label="Remover imagem"
                        title="Remover imagem"
                      >
                        <i
                          className="pi pi-trash"
                          aria-hidden="true"
                        ></i>
                        <span>Remover imagem</span>
                      </button>
                    </div>
                  )}

                  <p className="nova-field-hint">
                    <i className="pi pi-info-circle" aria-hidden="true"></i>
                    Prefira uma foto nítida, bem iluminada e que
                    represente a receita enviada.
                  </p>
                </div>
              </section>

              <div className="nova-form-final">
                <div className="nova-form-final-info">
                  <i className="pi pi-shield" aria-hidden="true"></i>

                  <div>
                    <strong>Antes de enviar</strong>
                    <p>
                      Confira os ingredientes, o modo de preparo e a imagem.
                      Sua receita será encaminhada para aprovação.
                    </p>
                  </div>
                </div>

                {erro && (
                  <div className="nova-form-erro" role="alert">
                    <i
                      className="pi pi-exclamation-circle"
                      aria-hidden="true"
                    ></i>
                    {erro}
                  </div>
                )}

                <button
                  type="submit"
                  className="nova-submit-button"
                  disabled={!formValido || enviando}
                >
                  {enviando ? (
                    <>
                      <i
                        className="pi pi-spin pi-spinner"
                        aria-hidden="true"
                      ></i>
                      Enviando receita...
                    </>
                  ) : (
                    <>
                      <i className="pi pi-send" aria-hidden="true"></i>
                      Enviar para aprovação
                      <i
                        className="pi pi-arrow-right"
                        aria-hidden="true"
                      ></i>
                    </>
                  )}
                </button>

                {!formValido && !enviando && (
                  <p className="nova-submit-hint">
                    Complete os campos obrigatórios para habilitar o envio.
                  </p>
                )}
              </div>
            </form>
          </div>

          <aside className="nova-info-card" aria-label="Dicas para enviar sua receita">
            <div className="nova-info-header">
              <span>Guia de publicação</span>

              <h2>
                <i className="pi pi-lightbulb" aria-hidden="true"></i>
                Dicas e informações
              </h2>
            </div>

            <div className="nova-info-body">
              <div className="nova-info-section">
                <h3>
                  <i
                    className="pi pi-info-circle"
                    aria-hidden="true"
                  ></i>
                  Como funciona?
                </h3>

                <p>
                  Após enviar sua receita, ela passará por uma análise
                  do nosso administrador. Você será notificado quando
                  for aprovada ou reprovada.
                </p>
              </div>

              <div className="nova-info-section">
                <h3>
                  <i
                    className="pi pi-check-circle"
                    aria-hidden="true"
                  ></i>
                  O que faz uma receita ser aprovada?
                </h3>

                <ul>
                  <li>
                    <i className="pi pi-check" aria-hidden="true"></i>
                    Título claro e descritivo
                  </li>
                  <li>
                    <i className="pi pi-check" aria-hidden="true"></i>
                    Ingredientes com quantidades e unidades corretas
                  </li>
                  <li>
                    <i className="pi pi-check" aria-hidden="true"></i>
                    Modo de preparo organizado em passos
                  </li>
                  <li>
                    <i className="pi pi-check" aria-hidden="true"></i>
                    Informação correta de tempo e porções
                  </li>
                  <li>
                    <i className="pi pi-check" aria-hidden="true"></i>
                    Imagem de qualidade da receita
                  </li>
                  <li>
                    <i className="pi pi-check" aria-hidden="true"></i>
                    Textos bem escritos e sem erros
                  </li>
                </ul>
              </div>

              <div className="nova-info-section">
                <h3>
                  <i
                    className="pi pi-times-circle"
                    aria-hidden="true"
                  ></i>
                  O que causa reprovação?
                </h3>

                <ul>
                  <li>
                    <i className="pi pi-times" aria-hidden="true"></i>
                    Ingredientes sem quantidade ou unidade
                  </li>
                  <li>
                    <i className="pi pi-times" aria-hidden="true"></i>
                    Modo de preparo confuso ou incompleto
                  </li>
                  <li>
                    <i className="pi pi-times" aria-hidden="true"></i>
                    Informações inconsistentes
                  </li>
                  <li>
                    <i className="pi pi-times" aria-hidden="true"></i>
                    Textos com muitos erros de português
                  </li>
                </ul>
              </div>

              <div className="nova-info-section">
                <h3>
                  <i className="pi pi-pencil" aria-hidden="true"></i>
                  Dicas para uma boa receita
                </h3>

                <div className="nova-info-tip">
                  <p>
                    <i
                      className="pi pi-check-circle"
                      aria-hidden="true"
                    ></i>
                    <span>
                      <strong>Revise antes de enviar!</strong> Verifique
                      as quantidades e unidades dos ingredientes.
                    </span>
                  </p>

                  <p>
                    <i
                      className="pi pi-check-circle"
                      aria-hidden="true"
                    ></i>
                    <span>
                      <strong>Seja específico</strong> nos passos do preparo.
                    </span>
                  </p>

                  <p>
                    <i
                      className="pi pi-check-circle"
                      aria-hidden="true"
                    ></i>
                    <span>
                      <strong>Use unidades padronizadas</strong> como
                      xícara, colher e gramas.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </PageWrapper>
  );
}

export default NovaReceita;