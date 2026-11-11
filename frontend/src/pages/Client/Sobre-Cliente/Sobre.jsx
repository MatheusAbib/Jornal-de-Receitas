import { useState } from 'react';
import PageWrapper from '../../../components/Global/PageWrapper/PageWrapper';
import './Sobre.css';

const timeline = [
  {
    ano: '2025',
    titulo: 'O início',
    texto: 'Um blog criado por mim, Matheus Abib, para compartilhar receitas que gosto. Primeiras 6 receitas publicadas manualmente.'
  },
  {
    ano: '2025',
    titulo: 'Primeira grande atualização',
    texto: 'Implementação do sistema de usuários e funcionalidade de favoritos. Lançando o site na web.'
  },
  {
    ano: '2026',
    titulo: 'Melhoria na experiência',
    texto: 'Melhor acesso a informações, design mais intuitivo e novas funcionalidades para os usuários.'
  }
];

const funcionalidades = [
  {
    icone: 'pi pi-images',
    titulo: 'Compartilhamento de receitas',
    descricao: 'Publique suas preparações com fotos e instruções.'
  },
  {
    icone: 'pi pi-verified',
    titulo: 'Curadoria de publicações',
    descricao: 'Receitas enviadas passam por um processo de aprovação.'
  },
  {
    icone: 'pi pi-heart',
    titulo: 'Favoritos personalizados',
    descricao: 'Salve suas receitas preferidas para consultar depois.'
  },
  {
    icone: 'pi pi-filter',
    titulo: 'Filtros de receitas',
    descricao: 'Encontre preparações por categoria e porções.'
  },
  {
    icone: 'pi pi-bell',
    titulo: 'Notificações',
    descricao: 'Receba atualizações sobre receitas e publicações.'
  }
];

const faq = [
  {
    pergunta: 'Como posso enviar minha própria receita?',
    resposta: 'Para enviar sua receita, basta criar uma conta, fazer login e clicar em "Nova Receita" no menu principal. A equipe revisará sua receita em até 48 horas. Se aprovada, ela será publicada com os devidos créditos!'
  },
  {
    pergunta: 'As receitas são testadas antes de serem publicadas?',
    resposta: 'Sim! Todas as receitas passam por um processo de teste. A equipe testa cada receita para garantir que as medidas, tempos e instruções estejam precisos e replicáveis em casa.'
  },
  {
    pergunta: 'O site é completamente gratuito?',
    resposta: 'Sim! O Jornal de Receitas é e sempre será gratuito para todos os usuários. A ideia é que seja um site útil para todos que buscam receitas caseiras.'
  }
];

function Sobre() {
  const [faqAberto, setFaqAberto] = useState(null);

  function toggleFaq(index) {
    setFaqAberto(prev => prev === index ? null : index);
  }

  return (
    <PageWrapper paginaAtual="sobre">
      <main className="sobre-container">
        <header className="sobre-header">
          <div className="sobre-header-topo">
            <span>Jornal de Receitas</span>
            <span>Desde 2025</span>
          </div>

          <div className="sobre-header-conteudo">
            <span className="sobre-editoria">Conheça o projeto</span>

            <h1>Sobre o Jornal</h1>

            <p>
              Um espaço para reunir receitas, compartilhar preparações
              e tornar a cozinha do dia a dia mais acessível.
            </p>
          </div>

          <div className="sobre-header-rodape">
            <span>
              <i className="pi pi-book" aria-hidden="true"></i>
              Nossa história
            </span>

            <span>
              <i className="pi pi-heart" aria-hidden="true"></i>
              Feito para quem gosta de cozinhar
            </span>
          </div>
        </header>

        <div className="sobre-content">
          <section className="sobre-introducao" aria-labelledby="sobre-introducao-titulo">
            <div className="sobre-introducao-marcador">
              <span>01 / Apresentação</span>
            </div>

            <div className="sobre-introducao-conteudo">
              <h2 id="sobre-introducao-titulo">
                Uma coleção de receitas que ganhou seu próprio espaço.
              </h2>

              <div className="sobre-introducao-textos">
                <p>
                  O Jornal de Receitas começou em 2025 como um projeto
                  pessoal de Matheus Abib, criado para reunir e compartilhar
                  receitas de que gostava.
                </p>

                <p>
                  Com o tempo, o que começou com seis receitas publicadas
                  manualmente ganhou novas funcionalidades, permitindo
                  que outras pessoas também participassem, salvassem
                  favoritos e compartilhassem suas preparações.
                </p>
              </div>
            </div>
          </section>

          <section className="sobre-section sobre-jornada" aria-labelledby="sobre-jornada-titulo">
            <div className="sobre-section-header">
              <div>
                <span className="sobre-section-kicker">02 / História</span>
                <h2 id="sobre-jornada-titulo">Nossa jornada</h2>
              </div>

              <p>
                Os principais momentos do desenvolvimento do projeto.
              </p>
            </div>

            <div className="journey-timeline">
              {timeline.map((item, index) => (
                <article className="timeline-item" key={`${item.ano}-${index}`}>
                  <div className="timeline-year">
                    <span>{item.ano}</span>
                  </div>

                  <div className="timeline-content">
                    <span className="timeline-indice">
                      Etapa {String(index + 1).padStart(2, '0')}
                    </span>

                    <h3>{item.titulo}</h3>
                    <p>{item.texto}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="sobre-missao" aria-labelledby="sobre-missao-titulo">
            <div className="sobre-missao-identificacao">
              <span>03 / Propósito</span>

              <i className="pi pi-heart" aria-hidden="true"></i>
            </div>

            <div className="sobre-missao-conteudo">
              <h2 id="sobre-missao-titulo">Nossa missão</h2>

              <p>
                Conectar pessoas através da culinária, oferecendo um
                espaço onde cozinheiros de todos os níveis possam
                compartilhar suas receitas favoritas e descobrir novas
                inspirações para o dia a dia.
              </p>
            </div>
          </section>

          <section className="sobre-section sobre-recursos" aria-labelledby="sobre-recursos-titulo">
            <div className="sobre-section-header">
              <div>
                <span className="sobre-section-kicker">04 / Funcionalidades</span>
                <h2 id="sobre-recursos-titulo">O que oferecemos</h2>
              </div>

              <p>
                Recursos para explorar, organizar e compartilhar receitas.
              </p>
            </div>

            <div className="sobre-recursos-grid">
              {funcionalidades.map((item, index) => (
                <article className="sobre-recurso" key={item.titulo}>
                  <div className="sobre-recurso-topo">
                    <i className={item.icone} aria-hidden="true"></i>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                  </div>

                  <h3>{item.titulo}</h3>
                  <p>{item.descricao}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="sobre-section sobre-faq" aria-labelledby="sobre-faq-titulo">
            <div className="sobre-section-header">
              <div>
                <span className="sobre-section-kicker">05 / Informações</span>
                <h2 id="sobre-faq-titulo">Perguntas frequentes</h2>
              </div>

              <p>
                Respostas para algumas dúvidas sobre o funcionamento do jornal.
              </p>
            </div>

            <div className="faq-container">
              {faq.map((item, index) => {
                const aberto = faqAberto === index;

                return (
                  <div
                    className={`faq-item ${aberto ? 'active' : ''}`}
                    key={index}
                  >
                    <h3 className="faq-heading">
                      <button
                        type="button"
                        className="faq-question"
                        onClick={() => toggleFaq(index)}
                        aria-expanded={aberto}
                        aria-controls={`sobre-faq-resposta-${index}`}
                        id={`sobre-faq-pergunta-${index}`}
                      >
                        <span className="faq-numero">
                          {String(index + 1).padStart(2, '0')}
                        </span>

                        <span className="faq-pergunta-texto">
                          {item.pergunta}
                        </span>

                        <i
                          className="pi pi-plus"
                          aria-hidden="true"
                        ></i>
                      </button>
                    </h3>

                    <div
                      className="faq-answer"
                      id={`sobre-faq-resposta-${index}`}
                      role="region"
                      aria-labelledby={`sobre-faq-pergunta-${index}`}
                      hidden={!aberto}
                    >
                      <p>{item.resposta}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="sobre-contato-section" aria-labelledby="sobre-contato-titulo">
            <div className="sobre-contato-conteudo">
              <span className="sobre-section-kicker">06 / Contato</span>

              <h2 id="sobre-contato-titulo">Entre em contato</h2>

              <p>
                Tem alguma dúvida, sugestão ou gostaria de colaborar
                com o Jornal de Receitas?
              </p>
            </div>

            <a
              className="sobre-contato-link"
              href="mailto:contato@jornalreceitas.com"
            >
              <i className="pi pi-envelope" aria-hidden="true"></i>

              <span>contato@jornalreceitas.com</span>

              <i className="pi pi-arrow-up-right" aria-hidden="true"></i>
            </a>
          </section>
        </div>

        <footer className="sobre-rodape">
          <span>Jornal de Receitas</span>
          <span>Receitas, histórias e boas preparações.</span>
        </footer>
      </main>
    </PageWrapper>
  );
}

export default Sobre;