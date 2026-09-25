import { useState } from 'react';
import Modal from "../Modal";
import Button from '../../Home/Button/Button';
import Input from '../../Home/Input/Input';
import { cadastrar } from "../../../services/authService";
import { extrairMensagemErro } from "../../../services/api";
import { useToast } from '../../../context/ToastContext';
import './ModalCadastro.css';

function ModalCadastro({ aberto, onFechar, onIrParaLogin }) {
  const { mostrarToast } = useToast();
  const [dados, setDados] = useState({
    nome: '', email: '', cpf: '', telefone: '',
    genero: '', senha: '', confirmarSenha: ''
  });
  const [alerta, setAlerta] = useState({ tipo: '', texto: '' });
  const [carregando, setCarregando] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  function handleChange(e) {
    setDados({ ...dados, [e.target.name]: e.target.value });
  }

  function validarCpf(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(10))) return false;
    return true;
  }

  const nomeValido = dados.nome.trim().length >= 3;
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email.trim());
  const cpfValido = validarCpf(dados.cpf);
  const telefoneValido = dados.telefone.replace(/\D/g, '').length >= 10;
  const generoValido = dados.genero.trim() !== '';
  const senhaValida = dados.senha.length >= 6;
  const confirmarValido = dados.confirmarSenha === dados.senha && dados.confirmarSenha.length >= 6;

  const botaoHabilitado =
    nomeValido && emailValido && cpfValido && telefoneValido &&
    generoValido && senhaValida && confirmarValido && !carregando;

  function mascaraCpf(valor) {
    let v = valor.replace(/\D/g, '').substring(0, 11);
    if (v.length > 3) v = v.slice(0, 3) + '.' + v.slice(3);
    if (v.length > 7) v = v.slice(0, 7) + '.' + v.slice(7);
    if (v.length > 11) v = v.slice(0, 11) + '-' + v.slice(11, 13);
    return v;
  }

  function mascaraTelefone(valor) {
    let v = valor.replace(/\D/g, '').substring(0, 11);
    if (v.length > 0) v = '(' + v;
    if (v.length > 3) v = v.slice(0, 3) + ') ' + v.slice(3);
    if (v.length > 9) v = v.slice(0, 9) + '-' + v.slice(9, 14);
    return v;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setAlerta({ tipo: '', texto: '' });
    setCarregando(true);

    try {
      const resultado = await cadastrar({
        nome: dados.nome,
        email: dados.email,
        cpf: dados.cpf.replace(/\D/g, ''),
        telefone: dados.telefone.replace(/\D/g, ''),
        genero: dados.genero,
        senha: dados.senha
      });

      if (resultado.success) {
        mostrarToast(resultado.message || 'Cadastro realizado com sucesso!', 'success');
        setAlerta({ tipo: 'success', texto: resultado.message || 'Cadastro realizado com sucesso!' });
        setTimeout(() => { handleFechar(); onIrParaLogin(); }, 2000);
      } else {
        const msg = resultado.message || 'Erro ao cadastrar';
        setAlerta({ tipo: 'error', texto: msg });
        mostrarToast(msg, 'error');
      }
    } catch (err) {
      const msg = extrairMensagemErro(err, 'Erro ao cadastrar');
      setAlerta({ tipo: 'error', texto: msg });
      mostrarToast(msg, 'error');
    } finally {
      setCarregando(false);
    }
  }

  function handleFechar() {
    setDados({ nome: '', email: '', cpf: '', telefone: '', genero: '', senha: '', confirmarSenha: '' });
    setAlerta({ tipo: '', texto: '' });
    onFechar();
  }

  return (
    <Modal aberto={aberto} onFechar={handleFechar} maxWidth="640px">
      <Modal.Header
        titulo="Criar Nova Conta"
        icone="pi pi-user-plus"
        onFechar={handleFechar}
      />

      <Modal.Body>

        {alerta.texto && (
          <div className={`modal-message modal-message-${alerta.tipo === 'error' ? 'error' : 'success'}`}>
            <i className={`pi ${alerta.tipo === 'error' ? 'pi-exclamation-circle' : 'pi-check-circle'}`}></i>
            <span>{alerta.texto}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="cadastro-form-group">
            <Input id="cadastroNome" label="Nome Completo" name="nome" icon="pi pi-user"
              value={dados.nome} onChange={handleChange} required />
          </div>

          <div className="cadastro-form-row">
            <div className="cadastro-form-group">
              <Input id="cadastroEmail" label="E-mail" name="email" type="email" icon="pi pi-envelope"
                value={dados.email} onChange={handleChange} required />
            </div>

            <div className="cadastro-form-group">
              <Input id="cadastroGenero" label="Gênero" name="genero" icon="pi pi-users"
                value={dados.genero} onChange={handleChange} required>
                <option value=""></option>
                <option value="MASCULINO">Masculino</option>
                <option value="FEMININO">Feminino</option>
                <option value="OUTRO">Outro</option>
              </Input>
            </div>
          </div>

          <div className="cadastro-form-row">
            <div className="cadastro-form-group">
              <Input id="cadastroCpf" label="CPF" name="cpf" icon="pi pi-id-card" maxLength={14}
                value={dados.cpf}
                onChange={(e) => setDados({ ...dados, cpf: mascaraCpf(e.target.value) })}
                required />
            </div>

            <div className="cadastro-form-group">
              <Input id="cadastroTelefone" label="Telefone" name="telefone" icon="pi pi-phone" maxLength={15}
                value={dados.telefone}
                onChange={(e) => setDados({ ...dados, telefone: mascaraTelefone(e.target.value) })}
                required />
            </div>
          </div>

          <div className="cadastro-form-row">
            <div className="cadastro-form-group">
              <Input id="cadastroSenha" label="Senha" name="senha"
                icon="pi pi-lock"
                value={dados.senha} onChange={handleChange}
                mostrarSenha={mostrarSenha}
                onToggleSenha={() => setMostrarSenha(!mostrarSenha)}
                required />
            </div>

            <div className="cadastro-form-group">
              <Input id="cadastroConfirmarSenha" label="Confirmar Senha" name="confirmarSenha"
                icon="pi pi-lock"
                value={dados.confirmarSenha} onChange={handleChange}
                mostrarSenha={mostrarConfirmar}
                onToggleSenha={() => setMostrarConfirmar(!mostrarConfirmar)}
                required />
            </div>
          </div>

          <Button
            variant="primary"
            type="submit"
            disabled={!botaoHabilitado}
            style={{ width: '100%', marginTop: 10 }}
          >
            {carregando ? (
              <><i className="pi pi-spin pi-spinner"></i> Cadastrando...</>
            ) : (
              <><i className="pi pi-user-plus"></i> Criar Conta</>
            )}
          </Button>

        </form>

        <div className="cadastro-login-link">
          Já tem uma conta?{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); handleFechar(); onIrParaLogin(); }}>
            Faça login
          </a>
        </div>

      </Modal.Body>
    </Modal>
  );
}

export default ModalCadastro;
