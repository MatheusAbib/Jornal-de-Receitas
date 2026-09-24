import { useState } from 'react';
import PageWrapper from "../../../components/Global/PageWrapper/PageWrapper";
import './Sobre.css';

function Sobre() {
  const [faqAberto, setFaqAberto] = useState(null);

  const timeline = [
    {
      ano: '2025',
      titulo: 'O Início',
      texto: 'Um blog criado por mim, Matheus Abib, para compartilhar receitas que gosto. Primeiras 6 receitas publicadas manualmente.'
    },
    {
      ano: '2025',
      titulo: 'Primeira Grande Atualização',
      texto: 'Implementação do sistema de usuários e funcionalidade de favoritos. Lançando o site na web.'
    },
    {
      ano: '2026',
      titulo: 'Melhoria na Experiência',
      texto: 'Melhor acesso a informações, design mais intuitivo e novas funcionalidades para os usuários.'
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

  function toggleFaq(index) {
    setFaqAberto(faqAberto === index ? null : index);
  }

  return (
    <PageWrapper paginaAtual="sobre">
      <div className="sobre-container">
        <div className="sobre-header">
          <h1><i className="pi pi-info-circle"></i> Sobre o Site</h1>
          <p className="sobre-subtitulo">Conheça o Jornal de Receitas</p>
        </div>

        <div className="sobre-content">

          <section className="sobre-section">
            <h2><i className="pi pi-book"></i> Nossa Jornada</h2>

            <div className="journey-timeline">
              {timeline.map((item, i) => (
                <div className="timeline-item" key={i}>
                  <div className="timeline-year">{item.ano}</div>
                  <div className="timeline-content">
                    <h4>{item.titulo}</h4>
                    <p>{item.texto}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="sobre-section">
            <h2><i className="pi pi-star"></i> Nossa Missão</h2>
            <p>
              Conectar pessoas através da culinária, oferecendo um espaço onde cozinheiros
              de todos os níveis possam compartilhar suas receitas favoritas e descobrir
              novas inspirações para o dia a dia.
            </p>
          </section>

          <section className="sobre-section">
            <h2><i className="pi pi-check-circle"></i> O que oferecemos</h2>
            <ul>
              <li><i className="pi pi-check"></i> Compartilhamento de receitas com fotos</li>
              <li><i className="pi pi-check"></i> Sistema de aprovação com curadoria</li>
              <li><i className="pi pi-check"></i> Favoritos personalizados</li>
              <li><i className="pi pi-check"></i> Filtros por categoria e porções</li>
              <li><i className="pi pi-check"></i> Notificações em tempo real</li>
            </ul>
          </section>

          <section className="sobre-section">
            <h2><i className="pi pi-question-circle"></i> Possíveis Dúvidas</h2>

            <div className="faq-container">
              {faq.map((item, i) => (
                <div
                  className={`faq-item ${faqAberto === i ? 'active' : ''}`}
                  key={i}
                >
                  <div className="faq-question" onClick={() => toggleFaq(i)}>
                    <span>{item.pergunta}</span>
                    <i className="pi pi-chevron-down"></i>
                  </div>
                  <div className="faq-answer">
                    <p>{item.resposta}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="sobre-section">
            <h2><i className="pi pi-envelope"></i> Contato</h2>
            <p>Tem alguma dúvida, sugestão ou quer colaborar? Entre em contato:</p>
            <p className="sobre-contato">
              <i className="pi pi-at"></i> contato@jornalreceitas.com
            </p>
          </section>

        </div>
      </div>
    </PageWrapper>
  );
}

export default Sobre;
