import { useState, useEffect, useRef } from 'react';
import Modal from '../Modal';
import Button from '../../Home/Button/Button';
import Input from '../../Home/Input/Input';
import { cadastrar } from '../../../services/authService';
import { extrairMensagemErro } from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import './ModalCadastro.css';

const dadosIniciais = {
  nome: '',
  email: '',
  cpf: '',
  telefone: '',
  genero: '',
  senha: '',
  confirmarSenha: ''
};

function ModalCadastro({ aberto, onFechar, onIrParaLogin }) {
  const { mostrarToast } = useToast();

  const [dados, setDados] = useState(dadosIniciais);
  const [alerta, setAlerta] = useState({ tipo: '', texto: '' });
  const [carregando, setCarregando] = useState(false);
  const [cadastroConcluido, setCadastroConcluido] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function limparFormulario() {
    setDados({ ...dadosIniciais });
    setAlerta({ tipo: '', texto: '' });
    setMostrarSenha(false);
    setMostrarConfirmar(false);
    setCadastroConcluido(false);
  }

  function handleFechar() {
    if (carregando) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    limparFormulario();
    onFechar();
  }

  function handleIrParaLogin() {
    if (carregando) return;

    handleFechar();
    onIrParaLogin();
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setDados(prev => ({
      ...prev,
      [name]: value
    }));

    if (alerta.tipo === 'error') {
      setAlerta({ tipo: '', texto: '' });
    }
  }

  function validarCpf(cpf) {
    const numeros = cpf.replace(/\D/g, '');

    if (numeros.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(numeros)) return false;

    let soma = 0;

    for (let i = 0; i < 9; i++) {
      soma += parseInt(numeros.charAt(i), 10) * (10 - i);
    }

    let resto = (soma * 10) % 11;

    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(numeros.charAt(9), 10)) return false;

    soma = 0;

    for (let i = 0; i < 10; i++) {
      soma += parseInt(numeros.charAt(i), 10) * (11 - i);
    }

    resto = (soma * 10) % 11;

    if (resto === 10 || resto === 11) resto = 0;

    return resto === parseInt(numeros.charAt(10), 10);
  }

  function mascaraCpf(valor) {
    const numeros = valor.replace(/\D/g, '').slice(0, 11);

    return numeros
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d{1,2})$/, '.$1-$2');
  }

  function mascaraTelefone(valor) {
    const numeros = valor.replace(/\D/g, '').slice(0, 11);

    if (!numeros) return '';

    if (numeros.length <= 2) {
      return `(${numeros}`;
    }

    if (numeros.length <= 6) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    }

    if (numeros.length <= 10) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
    }

    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
  }

  function handleCpfChange(e) {
    setDados(prev => ({
      ...prev,
      cpf: mascaraCpf(e.target.value)
    }));

    if (alerta.tipo === 'error') {
      setAlerta({ tipo: '', texto: '' });
    }
  }

  function handleTelefoneChange(e) {
    setDados(prev => ({
      ...prev,
      telefone: mascaraTelefone(e.target.value)
    }));

    if (alerta.tipo === 'error') {
      setAlerta({ tipo: '', texto: '' });
    }
  }

  const nomeValido = dados.nome.trim().length >= 3;
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email.trim());
  const cpfValido = validarCpf(dados.cpf);

  const quantidadeDigitosTelefone = dados.telefone.replace(/\D/g, '').length;
  const telefoneValido =
    quantidadeDigitosTelefone === 10 || quantidadeDigitosTelefone === 11;

  const generoValido = dados.genero.trim() !== '';
  const senhaValida = dados.senha.length >= 6;

  const confirmarValido =
    dados.confirmarSenha === dados.senha &&
    dados.confirmarSenha.length >= 6;

  const botaoHabilitado =
    nomeValido &&
    emailValido &&
    cpfValido &&
    telefoneValido &&
    generoValido &&
    senhaValida &&
    confirmarValido &&
    !carregando &&
    !cadastroConcluido;

  async function handleSubmit(e) {
    e.preventDefault();

    if (!botaoHabilitado) return;

    setAlerta({ tipo: '', texto: '' });
    setCarregando(true);

    try {
      const resultado = await cadastrar({
        nome: dados.nome.trim(),
        email: dados.email.trim(),
        cpf: dados.cpf.replace(/\D/g, ''),
        telefone: dados.telefone.replace(/\D/g, ''),
        genero: dados.genero,
        senha: dados.senha
      });

      if (resultado.success) {
        const mensagem =
          resultado.message || 'Cadastro realizado com sucesso!';

        setAlerta({
          tipo: 'success',
          texto: mensagem
        });

        setCadastroConcluido(true);
        mostrarToast(mensagem, 'success');

        timeoutRef.current = setTimeout(() => {
          timeoutRef.current = null;
          limparFormulario();
          onFechar();
          onIrParaLogin();
        }, 2000);
      } else {
        const mensagem =
          resultado.message || 'Não foi possível realizar o cadastro.';

        setAlerta({
          tipo: 'error',
          texto: mensagem
        });

        mostrarToast(mensagem, 'error');
      }
    } catch (err) {
      const mensagem = extrairMensagemErro(
        err,
        'Não foi possível realizar o cadastro.'
      );

      setAlerta({
        tipo: 'error',
        texto: mensagem
      });

      mostrarToast(mensagem, 'error');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <Modal
      aberto={aberto}
      onFechar={handleFechar}
      maxWidth="640px"
      className="cadastro-modal"
    >
      <Modal.Header
        titulo="Criar conta"
        icone="pi pi-user-plus"
        onFechar={handleFechar}
      />

      <Modal.Body className="cadastro-modal-body">
        <div className="cadastro-intro">
          <h3>Faça parte do nosso jornal</h3>

          <p>
            Crie sua conta para salvar receitas, organizar seus
            favoritos e compartilhar suas próprias preparações.
          </p>
        </div>

        {alerta.texto && (
          <div
            className={`modal-message modal-message-${alerta.tipo === 'error' ? 'error' : 'success'}`}
            role={alerta.tipo === 'error' ? 'alert' : 'status'}
          >
            <i
              className={`pi ${alerta.tipo === 'error' ? 'pi-exclamation-circle' : 'pi-check-circle'}`}
              aria-hidden="true"
            ></i>

            <span>{alerta.texto}</span>
          </div>
        )}

        <form
          className="cadastro-form"
          onSubmit={handleSubmit}
        >
          <div className="cadastro-secao">
            <div className="cadastro-secao-header">
              <span className="cadastro-secao-numero">01</span>
              <h4>Dados pessoais</h4>
            </div>

            <div className="cadastro-form-group">
              <Input
                id="cadastroNome"
                label="Nome completo"
                name="nome"
                icon="pi pi-user"
                value={dados.nome}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </div>

            <div className="cadastro-form-row">
              <div className="cadastro-form-group">
                <Input
                  id="cadastroEmail"
                  label="E-mail"
                  name="email"
                  type="email"
                  icon="pi pi-envelope"
                  value={dados.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="cadastro-form-group">
                <Input
                  id="cadastroGenero"
                  label="Gênero"
                  name="genero"
                  icon="pi pi-users"
                  value={dados.genero}
                  onChange={handleChange}
                  required
                >
                  <option value=""></option>
                  <option value="MASCULINO">Masculino</option>
                  <option value="FEMININO">Feminino</option>
                  <option value="OUTRO">Outro</option>
                </Input>
              </div>
            </div>

            <div className="cadastro-form-row">
              <div className="cadastro-form-group">
                <Input
                  id="cadastroCpf"
                  label="CPF"
                  name="cpf"
                  icon="pi pi-id-card"
                  maxLength={14}
                  value={dados.cpf}
                  onChange={handleCpfChange}
                  inputMode="numeric"
                  autoComplete="off"
                  required
                />
              </div>

              <div className="cadastro-form-group">
                <Input
                  id="cadastroTelefone"
                  label="Telefone"
                  name="telefone"
                  icon="pi pi-phone"
                  maxLength={15}
                  value={dados.telefone}
                  onChange={handleTelefoneChange}
                  inputMode="tel"
                  autoComplete="tel"
                  required
                />
              </div>
            </div>
          </div>

          <div className="cadastro-secao cadastro-secao-acesso">
            <div className="cadastro-secao-header">
              <span className="cadastro-secao-numero">02</span>
              <h4>Dados de acesso</h4>
            </div>

            <div className="cadastro-form-row">
              <div className="cadastro-form-group">
                <Input
                  id="cadastroSenha"
                  label="Senha"
                  name="senha"
                  icon="pi pi-lock"
                  value={dados.senha}
                  onChange={handleChange}
                  autoComplete="new-password"
                  mostrarSenha={mostrarSenha}
                  onToggleSenha={() => setMostrarSenha(prev => !prev)}
                  required
                />
              </div>

              <div className="cadastro-form-group">
                <Input
                  id="cadastroConfirmarSenha"
                  label="Confirmar senha"
                  name="confirmarSenha"
                  icon="pi pi-lock"
                  value={dados.confirmarSenha}
                  onChange={handleChange}
                  autoComplete="new-password"
                  mostrarSenha={mostrarConfirmar}
                  onToggleSenha={() => setMostrarConfirmar(prev => !prev)}
                  required
                />
              </div>
            </div>

            <p className="cadastro-senha-ajuda">
              <i className="pi pi-info-circle" aria-hidden="true"></i>
              A senha deve conter pelo menos 6 caracteres.
            </p>
          </div>

          <Button
            variant="primary"
            type="submit"
            disabled={!botaoHabilitado}
            className="cadastro-submit"
            style={{ width: '100%' }}
          >
            {carregando ? (
              <>
                <i
                  className="pi pi-spin pi-spinner"
                  aria-hidden="true"
                ></i>
                Cadastrando...
              </>
            ) : cadastroConcluido ? (
              <>
                <i
                  className="pi pi-check"
                  aria-hidden="true"
                ></i>
                Conta criada
              </>
            ) : (
              <>
                Criar minha conta
                <i
                  className="pi pi-arrow-right"
                  aria-hidden="true"
                ></i>
              </>
            )}
          </Button>
        </form>

        <div className="cadastro-login-link">
          <span>Já tem uma conta?</span>

          <button
            type="button"
            onClick={handleIrParaLogin}
            disabled={carregando}
          >
            Fazer login
            <i
              className="pi pi-arrow-right"
              aria-hidden="true"
            ></i>
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ModalCadastro;