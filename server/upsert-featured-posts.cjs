require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/al-profile-blog';
const ADMIN_OWNER_EMAIL = (process.env.ADMIN_OWNER_EMAIL || 'adrianolengruber@hotmail.com').trim().toLowerCase();

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  avatar: String
});

const postSchema = new mongoose.Schema({
  title: String,
  excerpt: String,
  content: String,
  imageUrl: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  authorName: String,
  authorAvatar: String,
  tags: [String],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  likesCount: Number,
  commentsCount: Number,
  readTime: String,
  createdAt: Date
});

const commentSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Post = mongoose.models.Post || mongoose.model('Post', postSchema);
const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema);

const oldSampleTitles = [
  'Introdução ao Machine Learning com Python',
  'ETL com Python: do básico ao pipeline confiável',
  'Dashboards que viram decisão'
];

const featuredPosts = [
  {
    title: 'AI Agents em producao: arquitetura, guardrails e ROI no mundo real',
    excerpt: 'Um guia pratico para desenhar agentes de IA que realmente entregam resultado: onde usar, como conectar ferramentas, que riscos controlar e como provar retorno para o negocio.',
    readTime: '14 min',
    tags: ['AI Agents', 'Automacao', 'Governanca', 'ROI'],
    createdAt: new Date('2026-04-14T18:10:00.000Z'),
    content: `A maior mudanca de 2026 nao e simplesmente a popularizacao da IA generativa. O que esta realmente ganhando espaco nas empresas e a evolucao de assistentes que apenas respondem para agentes que observam contexto, planejam etapas, executam acoes e devolvem resultado operacional.

Mas existe um erro recorrente: muita gente chama qualquer chatbot com prompt longo de "agente". Em producao, um agente de IA e um sistema composto por modelo, memoria, contexto, regras de decisao, ferramentas, observabilidade e limites claros de autonomia. Sem isso, o projeto vira apenas uma automacao fragil com risco alto de erro silencioso.

O primeiro ponto e entender quando vale usar AI Agents. Eles funcionam muito bem em fluxos com variacao moderada, alto custo humano de triagem e necessidade de decidir proximas acoes com base em contexto. Exemplos praticos:

- qualificacao comercial com enriquecimento de lead
- triagem de chamados e abertura de tarefas
- consolidacao de informacoes para atendimento
- leitura de documentos com roteamento por criterio
- acompanhamento de cobrancas, follow-up e operacao interna

Nem todo processo deve virar agente. Se a regra e fixa, previsivel e 100% deterministica, automacao classica quase sempre e melhor. O agente entra quando existe ambiguidade suficiente para justificar linguagem natural, classificacao contextual, priorizacao ou decisao assistida.

Uma arquitetura confiavel costuma ter seis camadas:

1. Entrada estruturada
O agente precisa receber dados limpos: formulario, webhook, CRM, e-mail, documento ou evento de sistema. Quanto melhor a entrada, menor o custo de raciocinio e menor a chance de resposta errada.

2. Contexto
Contexto nao e despejar tudo no prompt. E selecionar o que importa para aquela tarefa: regras do negocio, historico do cliente, status do projeto, politicas de atendimento, FAQ ou base documental.

3. Ferramentas
Agente util executa acoes reais. Pode consultar API, criar item em board, atualizar CRM, buscar dados no banco, enviar e-mail, registrar resumo ou disparar uma automacao no n8n.

4. Politica de decisao
Aqui entram os guardrails: quando pode responder sozinho, quando precisa pedir confirmacao, quando deve escalar para humano, quando deve bloquear a operacao.

5. Observabilidade
Se voce nao registra entrada, decisao, ferramenta usada, tempo, custo e resultado, nao existe gestao do agente. Existe sorte.

6. Revisao continua
Agente em producao precisa de avaliacao periodica. Quais erros estao se repetindo? Em que etapa ele hesita? Quais dados estao faltando? Onde existe retrabalho humano?

Guardrails sao o coracao do projeto. A empresa nao quebra porque o modelo "errou uma frase". Ela quebra quando o sistema toma uma decisao operacional ruim sem controle. Por isso, recomendo sempre uma matriz simples de risco:

- baixo risco: responder pergunta frequente, resumir historico, classificar assunto
- medio risco: sugerir prioridade, montar rascunho, recomendar proxima acao
- alto risco: aprovar gasto, alterar contrato, excluir dado, enviar mensagem sensivel, assumir compromisso comercial

Quanto maior o risco, menor a autonomia. Em muitos casos, o melhor desenho nao e "agente autonomo", mas sim "agente copiloto com confirmacao humana".

Outro ponto critico e memoria. Nem todo agente precisa de memoria de longo prazo. Em muitos cenarios, basta contexto transacional da tarefa atual. Salvar memoria irrelevante aumenta custo, confusao e risco de vazamento de informacao. A regra pratica e: persista somente o que melhora decisoes futuras.

Para medir ROI, evite metricas vagas como "ficou mais moderno" ou "a equipe gostou". O que importa e impacto operacional:

- tempo economizado por processo
- volume absorvido sem aumento de equipe
- reducao de SLA
- menos erro manual
- mais leads qualificados
- mais tarefas resolvidas na primeira passagem

Uma formula simples ajuda:

ROI operacional = (horas economizadas + receita adicional + perdas evitadas - custo de operacao) / custo de operacao

Se o agente custa R$ 2.000 por mes e economiza 80 horas de um time cujo custo efetivo medio e R$ 50/h, ele ja entrega R$ 4.000 em ganho bruto de capacidade, sem contar efeito em velocidade, qualidade e receita.

Na pratica, os melhores projetos de agentes seguem um caminho incremental:

Fase 1: copiloto interno
O agente le contexto, sugere classificacao, produz resumo e recomenda acao.

Fase 2: execucao supervisionada
O agente executa tarefas de baixo risco com log completo.

Fase 3: autonomia seletiva
Somente fluxos maduros e bem observados ganham autonomia parcial.

Fase 4: orchestracao multiagente
Diferentes agentes assumem subtarefas, mas ainda com regras claras de passagem e auditoria.

Se eu tivesse que resumir em uma frase: AI Agent bom nao e o que "parece inteligente", mas o que opera dentro de um desenho seguro, mensuravel e util para o negocio. O futuro pertence a quem transformar IA em processo confiavel, nao em demo impressionante.

Checklist final para qualquer implantacao:

- problema real e frequente
- dados de entrada minimamente organizados
- ferramenta ou acao clara no fim do fluxo
- criterio explicito de escalonamento humano
- logs e metricas de desempenho
- revisao quinzenal no inicio da operacao

Se esses seis itens existirem, o projeto ja comeca no terreno certo.`
  },
  {
    title: 'Power BI, Copilot e camada semantica: como sair do dashboard e chegar a decisao',
    excerpt: 'Relatorio bonito nao basta. Este artigo mostra como combinar modelagem, DAX, camada semantica e recursos de IA para transformar Power BI em plataforma de decisao, e nao apenas de visualizacao.',
    readTime: '13 min',
    tags: ['Power BI', 'Copilot', 'Business Intelligence', 'DAX'],
    createdAt: new Date('2026-04-14T18:05:00.000Z'),
    content: `Um dos maiores problemas em BI nao e falta de painel. E excesso de painel. Empresas acumulam dashboards, paginas, filtros, graficos e indicadores, mas continuam sem clareza sobre qual numero orientar, que decisao tomar e quem deve agir depois da leitura.

Em 2026, o salto de maturidade em Business Intelligence passa por tres pilares: camada semantica bem desenhada, metricas confiaveis e interfaces mais naturais de exploracao, incluindo experiencias com Copilot. O ponto principal, porem, continua sendo o mesmo: sem modelo certo, nao existe IA que salve o relatorio.

Vamos comecar pela camada semantica. Em termos simples, ela e a traducao do negocio para uma estrutura analitica consistente. Em vez de cada usuario reinventar calculos, nomes e filtros, a empresa centraliza definicoes: o que e faturamento liquido, o que conta como cliente ativo, como medir churn, como definir margem, como separar meta realizada de pipeline.

Quando a camada semantica e fraca, acontecem sintomas conhecidos:

- duas areas mostram numeros diferentes para a mesma pergunta
- o usuario perde tempo validando o relatorio antes de interpretar
- cada dashboard vira uma ilha
- o time de dados vira suporte infinito de ajuste de medida

Por outro lado, quando a camada semantica esta madura, o Power BI deixa de ser um conjunto de paginas e passa a funcionar como produto analitico.

Os cinco fundamentos de uma base forte sao:

1. Modelo dimensional coerente
Fatos e dimensoes bem definidos ainda sao a espinha dorsal do desempenho e da interpretacao. Nao adianta querer IA se a modelagem mistura granularidades ou replica logica em visual.

2. Medidas oficiais
Tudo o que for estrategico deve estar encapsulado em medidas versionadas, revisadas e nomeadas com linguagem de negocio.

3. Dicionario de metricas
Cada KPI precisa responder: o que mede, como calcula, com que frequencia atualiza, quem e dono e que decisao suporta.

4. Hierarquia de consumo
Executivo precisa decisao. Gestor precisa diagnostico. Operacao precisa acao. O mesmo dado nao deve ser apresentado da mesma forma para todos.

5. Governanca de publicacao
Sem padrao de workspace, homologacao, permissao e ownership, o ambiente vira desorganizado rapidamente.

E onde entra o Copilot? O valor dele nao esta em "fazer graficos sozinho". O valor esta em reduzir atrito entre pergunta e insight. Quando o modelo esta preparado, recursos conversacionais ajudam a:

- resumir variacoes relevantes
- sugerir exploracoes
- montar formulas iniciais
- acelerar descoberta de anomalias
- reduzir dependencia de navegacao manual complexa

Mas existe um ponto que pouca gente fala: Copilot nao substitui criterio analitico. Ele acelera exploracao, nao substitui modelagem, governanca e interpretacao.

Um erro comum e tentar usar IA sobre um relatorio desorganizado. O resultado costuma ser resposta plausivel, mas pouco confiavel. A ordem certa e:

primeiro organizar o dado
depois consolidar metricas
depois desenhar a jornada de leitura
so entao aplicar recursos de IA para acelerar consumo

Se o objetivo e decisao, seu dashboard precisa responder quatro perguntas sem esforco:

- o que aconteceu?
- por que aconteceu?
- onde agir primeiro?
- qual a proxima melhor acao?

Grande parte dos paineis para na primeira pergunta. Alguns chegam na segunda. Poucos ajudam de verdade na terceira e na quarta. E exatamente nessa passagem que BI de alto nivel se diferencia.

Veja um exemplo simples de estrutura:

Nivel 1: visao executiva
Poucos indicadores, tendencia, comparativo com meta, alertas e resumo de variacao.

Nivel 2: diagnostico gerencial
Analise por canal, produto, equipe, regiao, carteira ou etapa do funil.

Nivel 3: acao operacional
Lista priorizada de itens criticos, clientes em risco, pedidos atrasados, contratos sem renovacao, contas a receber vencidas.

Quando voce conecta esses niveis, o BI para de ser "painel para olhar" e vira "sistema para agir".

No DAX, a recomendacao mais pratica e fugir do improviso. Medida de negocio precisa ser clara, nomeada e testada. Algumas boas praticas:

- separar medida base de medida derivada
- evitar logica repetida em multiplos visuais
- usar nomes compreensiveis pelo negocio
- documentar filtros implicitos
- testar cenarios de borda

Outro tema essencial em 2026 e desempenho. Ambientes com Direct Lake, modelos grandes e consultas cada vez mais conversacionais exigem disciplina. Se o relatorio demora, a confianca cai. Alguns cuidados:

- reduzir colunas inutilizadas
- preservar granularidade correta
- evitar medidas excessivamente iterativas sem necessidade
- padronizar chaves e calendario
- revisar visualizacoes que fazem consultas pesadas sem ganho real

Agora, a parte estrategica: o melhor dashboard nao e o mais bonito. E o que diminui reuniao improdutiva, reduz debate sobre numero errado e acelera resposta do negocio. Se o time passa meia hora discutindo de onde veio o dado, o problema nao esta no grafico; esta na arquitetura de informacao.

Uma implementacao madura de Power BI hoje precisa combinar:

- engenharia de dados confiavel na origem
- modelagem analitica limpa
- metricas bem governadas
- experiencia de consumo orientada a decisao
- IA como aceleradora, nao como muleta

Se voce quiser avaliar o nivel de maturidade do seu BI, faca este teste:

1. Existe uma definicao oficial para os KPIs mais importantes?
2. Dois usuarios diferentes chegam ao mesmo numero?
3. O painel aponta prioridade ou apenas mostra volume?
4. O time confia nos dados sem precisar validar toda semana?
5. O gestor sabe o que fazer depois de abrir o relatorio?

Se a resposta for "nao" para varios itens, o proximo passo nao e criar mais visual. E reorganizar a base semantica.

No fim, BI excelente nao e sobre ver mais dados. E sobre reduzir ambiguidade para decidir melhor. E e por isso que Power BI, DAX e Copilot so entregam valor maximo quando trabalham em cima de uma camada semantica pensada como ativo estrategico do negocio.`
  },
  {
    title: 'Data Engineering para IA: lakehouse, contratos de dados e observabilidade sem romantizacao',
    excerpt: 'IA boa depende de dado confiavel. Entenda como estruturar pipelines, qualidade, camada semantica tecnica e monitoramento para suportar analytics e agentes de IA sem apagar incendio todo dia.',
    readTime: '15 min',
    tags: ['Data Engineering', 'ETL', 'Lakehouse', 'Observabilidade'],
    createdAt: new Date('2026-04-14T18:00:00.000Z'),
    content: `Toda empresa quer usar IA, mas poucas estao preparadas para a conversa menos glamourosa e mais importante do projeto: engenharia de dados. Sem pipeline confiavel, documentacao minima, contratos de dado e monitoramento, a IA vira apenas uma camada cara em cima de informacao inconsistente.

Em 2026, a pressa para colocar modelos e agentes em producao esta fazendo muita organizacao descobrir da pior forma que analytics e IA nao escalam sobre planilhas soltas, nomes ambiguos, fontes contraditorias e ETL improvisado.

O primeiro conceito que precisa ficar claro e este: dado para IA nao e apenas volume. E disponibilidade com contexto, consistencia e rastreabilidade.

Quando a base e ruim, os sintomas aparecem rapido:

- respostas contraditorias entre sistemas
- relatorios que mudam sem explicacao
- prompts cada vez maiores para compensar falta de estrutura
- agente que decide com base em informacao vencida
- time operacional desconfiando de tudo

Por isso, engenharia de dados moderna precisa ser vista como sistema de confianca. E tres componentes ganharam protagonismo:

1. Lakehouse pragmatica
O valor da abordagem lakehouse nao esta no hype. Esta em aproximar flexibilidade de armazenamento e consumo analitico com menos friccao entre ingestao, transformacao e exploracao. O ponto principal nao e "ter lakehouse", mas ter camadas claras.

Uma estrutura simples e eficaz:

- bronze: dado bruto, historico, sem embelezamento
- silver: dado tratado, padronizado, deduplicado, validado
- gold: tabelas prontas para negocio, BI e produtos de dados

Se voce mistura tudo na mesma camada, perde auditoria. Se exagera na complexidade cedo demais, trava entrega. O ideal e maturidade incremental.

2. Contratos de dados
Contrato de dados e um acordo explicito sobre formato, significado, frequencia, ownership e expectativa de qualidade de uma fonte. Em outras palavras: o produtor deixa de jogar dado para o consumidor "se virar".

Um contrato minimamente util deve dizer:

- qual tabela ou evento sera entregue
- quais campos sao obrigatorios
- tipo e formato esperado
- regra de atualizacao
- limite aceitavel de nulos, duplicidade e atraso
- dono tecnico e dono de negocio

Sem contrato, cada mudanca na origem quebra varios consumidores em cadeia.

3. Observabilidade
Monitorar so "job rodou ou falhou" nao basta mais. Pipeline pode terminar com sucesso e ainda assim entregar lixo. Observabilidade de dados precisa olhar:

- freshness: o dado chegou no horario esperado?
- volume: chegou muito menos ou muito mais que o normal?
- schema: algum campo mudou sem alinhamento?
- distribuicao: os valores se comportam como esperado?
- lineage: quem depende dessa tabela?

Esse tipo de visibilidade reduz tempo de descoberta, evita erro silencioso e muda a postura do time de reativa para preventiva.

Agora, a parte pratica: como montar uma base que aguente BI e IA ao mesmo tempo?

Passo 1: mapear sistemas criticos
Nao comece querendo integrar tudo. Escolha as fontes que sustentam receita, operacao, atendimento ou decisao executiva.

Passo 2: definir chave e granularidade
Boa parte do caos analitico vem de tabelas sem chave clara ou misturando niveis diferentes no mesmo dataset.

Passo 3: estabelecer testes minimos
Exemplos: unicidade, nao nulo, referencia valida, range esperado, atraso maximo.

Passo 4: padronizar nomenclatura e datas
Campo inconsistente gera retrabalho desnecessario em SQL, BI e aplicacoes.

Passo 5: versionar transformacoes
Se a logica muda, isso precisa ser rastreavel. Engenharia madura nao vive de ajuste invisivel em producao.

Passo 6: separar consumo operacional de analitico
Nem toda tabela transacional deve ser consultada diretamente por dashboard, relatorio ou agente.

Um tema negligenciado e custo. Pipelines ruins nao so quebram mais: eles custam mais. Query pesada, retrabalho manual, reconciliação constante, armazenamento sem criterio e incidentes frequentes comem margem de forma silenciosa. E por isso que "organizar dados" nao e apenas tema tecnico. E agenda financeira.

Quando entra IA generativa ou agentes, a exigencia aumenta. O modelo precisa de contexto confiavel. Se a fonte estiver atrasada ou mal descrita, a resposta pode ate soar convincente, mas sera operacionalmente perigosa. Em outras palavras: qualidade de dado vira controle de risco da IA.

Uma boa arquitetura para empresas em crescimento costuma combinar:

- ingestao automatizada por APIs, banco, arquivos ou webhooks
- transformacao padronizada em camadas
- storage preparado para historico e reprocessamento
- tabelas analiticas orientadas a negocio
- exposicao controlada para BI, APIs e agentes

No dia a dia, alguns habitos fazem enorme diferenca:

- cada pipeline tem dono
- cada tabela importante tem descricao
- incidentes relevantes viram aprendizado permanente
- anomalias geram alerta antes de virar erro no dashboard
- mudancas na origem passam por comunicacao minima

Se voce esta em uma operacao menor, nao precisa esperar stack perfeita para agir. E totalmente possivel comecar bem usando Python, SQL, jobs agendados, logs consistentes e alguns testes simples. O que importa e disciplina de desenho, nao fetiche por ferramenta.

Um bom time de dados hoje precisa equilibrar tres compromissos:

velocidade para entregar
clareza para sustentar
qualidade para escalar

Quando um desses lados domina sozinho, surgem distorcoes. So velocidade gera bagunca. So controle gera lentidao. So qualidade teorica sem entrega gera irrelevancia.

Se eu tivesse que deixar um framework rapido para avaliar maturidade, seria este:

Nivel 1 - artesanal
Extracoes manuais, ajustes frequentes, baixa confianca.

Nivel 2 - automatizado sem governanca
Jobs existem, mas quebram com facilidade e dependem de conhecimento concentrado.

Nivel 3 - confiavel para BI
Camadas mais claras, metricas oficiais, menos divergencia.

Nivel 4 - pronto para IA operacional
Observabilidade, contratos, lineage e contexto confiavel para agentes e copilotos.

No fim, engenharia de dados nao aparece tanto quanto um dashboard bonito ou um agente que fala bem. Mas e ela que decide se o sistema entrega valor com consistencia ou se vira mais uma promessa fraca. Quem organiza dado primeiro constroi vantagem real depois.`
  }
];

async function run() {
  await mongoose.connect(MONGODB_URI);

  const owner = await User.findOne({ email: ADMIN_OWNER_EMAIL }) || await User.findOne();
  if (!owner) {
    throw new Error('Nenhum usuario encontrado para associar os posts.');
  }

  const postsToDelete = await Post.find({ title: { $in: oldSampleTitles } }, { _id: 1 });
  const deleteIds = postsToDelete.map((post) => post._id);

  if (deleteIds.length > 0) {
    await Comment.deleteMany({ post: { $in: deleteIds } });
    await Post.deleteMany({ _id: { $in: deleteIds } });
  }

  for (const post of featuredPosts) {
    await Post.findOneAndUpdate(
      { title: post.title },
      {
        ...post,
        imageUrl: '',
        author: owner._id,
        authorName: owner.username || 'Adriano Lengruber',
        authorAvatar: owner.avatar || '',
        likes: [],
        likesCount: 0,
        commentsCount: 0
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }
    );
  }

  console.log(`Posts em destaque atualizados com sucesso para ${owner.username || owner.email}.`);
  await mongoose.disconnect();
}

run().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
