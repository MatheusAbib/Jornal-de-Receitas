### Script diagrama de Sequencia

**Bloco 1** – Entrada da requisição

“Aqui à esquerda temos o Visitante acessando a página inicial e chamando GET /api/receitas.

O ReceitaController recebe essa requisição e chama o ReceitaService.listarAprovadas(),

que por sua vez chama o IReceitaDAO.listarPorStatus(APROVADA) para buscar no banco só as receitas aprovadas.”



(aponta as setas Visitante → Controller → Service → DAO → Service → Controller)



**Bloco 2** – Loop por receita

“Quando o controller recebe a lista de receitas aprovadas, ele entra nesse loop ‘Para cada receita’.



Para cada uma delas, ele chama um método interno receitaParaMap(receita, true),

que transforma a Receita em um Map com os dados que vão ser enviados para o frontend.



Ou seja: o Map é a estrutura em Java que eu uso para montar os dados,

e o Spring transforma esse Map em JSON na resposta.



Esse true significa: inclua os favoritos (total de curtidas) quando montar o map da receita.”



(aponta o fragmento loop e a autochamada Controller -> Controller : receitaParaMap)



**Bloco 3** – Favoritos e complexidade

“Dentro desse receitaParaMap, primeiro eu chamo o FavoritoService.contarCurtidas(receita)

para saber quantas curtidas aquela receita tem. Isso volta como um long (um tipo numérico)

e entra no JSON como o campo totalFavoritos.



Em seguida, eu chamo o ComplexidadeService.calcular(receita).

O service de complexidade monta a cadeia de calculadoras (base + decorators) e chama o calcular dessa cadeia.

Essa cadeia é representada aqui pelo componente CalculadoraDeComplexidade,

que é justamente onde eu aplico o padrão Decorator.”



(aponta as setas Controller → Favorito → Controller, depois Controller → Complexidade → Calculadora)



**Bloco 4** – Decorator e resposta final

“Aqui na nota à direita eu mostro a cadeia de Decorators usada no cálculo:

começo com a CalculadoraBase e vou encapando com:



DecoratorPorIngredientes,

DecoratorPorModoPreparo,

DecoratorPorTempoPreparo,

DecoratorPorCategoria.



Cada decorator soma pontos à complexidade, e no final essa cadeia retorna um objeto Complexidade

com nivel, descricao e pontuacao.

O controller pega esse objeto e inclui esses três dados no JSON de cada receita.



Depois que o loop termina, o controller devolve um 200 OK com { receitas: \[...] }

para o visitante, já com favoritos e complexidade calculados para cada receita.”





### Script diagrama de Classe

"No diagrama, CalculadoraDeComplexidade é uma interface que define o método calcular(Receita): Complexidade. A CalculadoraBase implementa essa interface e é o componente concreto básico: ela sempre devolve uma complexidade inicial, com nível 1, descrição “Fácil” e pontuação 0.



A CalculadoraDecorator é uma classe abstrata que também implementa CalculadoraDeComplexidade e tem uma referência para outra CalculadoraDeComplexidade interna. Em cima dela, você tem quatro classes concretas que herdam de CalculadoraDecorator: DecoratorPorIngredientes, DecoratorPorModoPreparo, DecoratorPorTempoPreparo e DecoratorPorCategoria. Cada uma acrescenta um critério de pontuação ao cálculo, mas todas seguem o mesmo contrato da interface.



A classe Receita é a entidade de entrada do cálculo (fornece ingredientes, modo de preparo, tempo e categoria), e a classe Complexidade é o resultado, com nível, descrição e pontuação. O ComplexidadeService é um serviço que usa a interface CalculadoraDeComplexidade: ele instancia a CalculadoraBase, encadeia os decorators e chama calcular(receita) para obter um objeto Complexidade, que depois é usado pelo controller.”





### Script Testes Unitários

Rodar somente os decorators: mvn -Dtest="com.receitas.site\_receitas.decorator.complexidade.\*Test" test

Rodar um específico: mvn -Dtest=CalculadoraCompletaTest test

Rodar tudo: mvn test



Os testes são automatizados com Maven.

Quando eu rodo mvn test, o Maven usa o plugin Surefire para:

compilar a pasta src/test/java, rodar todos os métodos anotados com @Test e, se todos passarem, mostra BUILD SUCCESS no terminal.



Nos models, builders e factories eu testo as regras de negócio das entidades (Receita, Usuario, Estatisticas) e se os objetos são construídos corretamente.

No Decorator de complexidade, eu tenho testes para cada decorator isolado (ingredientes, modo de preparo, tempo, categoria) e um teste da cadeia completa, garantindo que o objeto Complexidade final tenha a pontuação, o nível e a descrição corretos.

Nos Commands (AprovarReceitaCommand, RejeitarReceitaCommand, ExcluirReceitaCommand, AtualizarEstatisticasCommand), eu uso mocks dos services e DAOs para verificar se o comando altera o estado certo (status da receita, estatísticas, notificações) sem depender de infraestrutura.

Nos Services (ReceitaService, FavoritoService, NotificacaoService, UsuarioService, AuthService, ComplexidadeService), eu testo a lógica de negócio isolada, simulando os DAOs com Mockito e garantindo que as operações de negócio estão corretas.”



**CalculadoraCompletaTest**

“Aqui é um exemplo de teste da cadeia completa do Decorator de complexidade.



Primeiro eu monto a cadeia:



CalculadoraDeComplexidade calculadora = new CalculadoraBase();

calculadora = new DecoratorPorIngredientes(calculadora);

calculadora = new DecoratorPorModoPreparo(calculadora);

calculadora = new DecoratorPorTempoPreparo(calculadora);

calculadora = new DecoratorPorCategoria(calculadora);



Depois eu crio uma receita de teste e verifico o resultado.

Por exemplo, neste teste eu monto uma receita “máxima” com muitos ingredientes, muitos passos, bastante tempo e categoria DOCE.

Quando eu chamo calculadora.calcular(receita), eu espero uma Complexidade com pontuacao = 7 e descrição “Difícil”.



Nos outros métodos eu testo casos como ‘Brigadeiro’ (que continua fácil) e ‘Risoto’ (que cai em complexidade média), garantindo que o somatório dos decorators e a conversão para nível/descrição estão corretos.”



**O que eu uso para os testes:**

**1. JUnit 5**

JUnit 5 é o framework de testes. Ele aparece em:



As anotações:

@Test

@BeforeEach

@DisplayName



**2. Mockito**

Mockito é a biblioteca que você usa para criar mocks (objetos simulados) e verificar interações.



**3. AssertJ**

O AssertJ é a biblioteca que eu uso para fazer as verificações dos testes de forma mais legível.



### Decorators

Vantagens:

1. Separar cada critério em uma classe própria (5 peças separadas)
2. Poder somar critérios em cadeia, sem acoplamento
3. Ficar aberto para extensão





