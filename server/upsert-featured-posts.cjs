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

const legacyFeaturedTitles = [
  'AI Agents em producao: arquitetura, guardrails e ROI no mundo real',
  'Power BI, Copilot e camada semantica: como sair do dashboard e chegar a decisao',
  'Data Engineering para IA: lakehouse, contratos de dados e observabilidade sem romantizacao'
];

const featuredPosts = [
  {
    title: 'AI Agents em produção: arquitetura, guardrails e ROI no mundo real',
    excerpt: 'Um guia prático para desenhar agentes de IA que realmente entregam resultado, com arquitetura, limites de autonomia, métricas de operação e critérios concretos de retorno.',
    readTime: '14 min',
    tags: ['AI Agents', 'Automação', 'Governança', 'ROI'],
    createdAt: new Date('2026-04-11T14:20:00.000Z'),
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
    content: `A grande mudança de 2026 não é apenas a popularização da IA generativa. O que realmente está ganhando espaço nas empresas é a evolução de assistentes que só respondem para agentes que observam contexto, planejam etapas, executam ações e devolvem resultado operacional.

Mas existe um erro recorrente: muita gente chama qualquer chatbot com prompt longo de "agente". Em produção, um agente de IA é um sistema composto por modelo, contexto, regras de decisão, ferramentas, observabilidade e limites claros de autonomia. Sem isso, o projeto vira apenas uma automação frágil com risco alto de erro silencioso.

O primeiro ponto é entender quando vale usar AI Agents. Eles funcionam muito bem em fluxos com variação moderada, alto custo humano de triagem e necessidade de decidir próximas ações com base em contexto. Alguns exemplos práticos:

- qualificação comercial com enriquecimento de lead
- triagem de chamados e abertura de tarefas
- consolidação de informações para atendimento
- leitura de documentos com roteamento por critério
- acompanhamento de cobranças, follow-up e operação interna

Nem todo processo deve virar agente. Se a regra é fixa, previsível e 100% determinística, automação clássica quase sempre é melhor. O agente entra quando existe ambiguidade suficiente para justificar linguagem natural, classificação contextual, priorização ou decisão assistida.

Uma arquitetura confiável costuma ter seis camadas:

1. Entrada estruturada
O agente precisa receber dados limpos: formulário, webhook, CRM, e-mail, documento ou evento de sistema. Quanto melhor a entrada, menor o custo de raciocínio e menor a chance de resposta errada.

2. Contexto
Contexto não é despejar tudo no prompt. É selecionar o que importa para aquela tarefa: regras do negócio, histórico do cliente, status do projeto, políticas de atendimento, FAQ ou base documental.

3. Ferramentas
Agente útil executa ações reais. Pode consultar API, criar item em board, atualizar CRM, buscar dados no banco, enviar e-mail, registrar resumo ou disparar uma automação no n8n.

4. Política de decisão
Aqui entram os guardrails: quando pode responder sozinho, quando precisa pedir confirmação, quando deve escalar para humano e quando deve bloquear a operação.

5. Observabilidade
Se você não registra entrada, decisão, ferramenta usada, tempo, custo e resultado, não existe gestão do agente. Existe sorte.

6. Revisão contínua
Agente em produção precisa de avaliação periódica. Quais erros estão se repetindo? Em que etapa ele hesita? Quais dados estão faltando? Onde existe retrabalho humano?

Guardrails são o coração do projeto. A empresa não quebra porque o modelo errou uma frase. Ela quebra quando o sistema toma uma decisão operacional ruim sem controle. Por isso, recomendo sempre uma matriz simples de risco:

- baixo risco: responder pergunta frequente, resumir histórico, classificar assunto
- médio risco: sugerir prioridade, montar rascunho, recomendar próxima ação
- alto risco: aprovar gasto, alterar contrato, excluir dado, enviar mensagem sensível, assumir compromisso comercial

Quanto maior o risco, menor a autonomia. Em muitos casos, o melhor desenho não é "agente autônomo", mas sim "agente copiloto com confirmação humana".

Outro ponto crítico é memória. Nem todo agente precisa de memória de longo prazo. Em muitos cenários, basta o contexto transacional da tarefa atual. Salvar memória irrelevante aumenta custo, confusão e risco de vazamento de informação. A regra prática é: persista somente o que melhora decisões futuras.

Para medir ROI, evite métricas vagas como "ficou mais moderno" ou "a equipe gostou". O que importa é impacto operacional:

- tempo economizado por processo
- volume absorvido sem aumento de equipe
- redução de SLA
- menos erro manual
- mais leads qualificados
- mais tarefas resolvidas na primeira passagem

Uma fórmula simples ajuda:

ROI operacional = (horas economizadas + receita adicional + perdas evitadas - custo de operação) / custo de operação

Se o agente custa R$ 2.000 por mês e economiza 80 horas de um time cujo custo efetivo médio é R$ 50/h, ele já entrega R$ 4.000 em ganho bruto de capacidade, sem contar efeito em velocidade, qualidade e receita.

Na prática, os melhores projetos de agentes seguem um caminho incremental:

Fase 1: copiloto interno
O agente lê contexto, sugere classificação, produz resumo e recomenda ação.

Fase 2: execução supervisionada
O agente executa tarefas de baixo risco com log completo.

Fase 3: autonomia seletiva
Somente fluxos maduros e bem observados ganham autonomia parcial.

Fase 4: orquestração multiagente
Diferentes agentes assumem subtarefas, mas ainda com regras claras de passagem e auditoria.

Se eu tivesse que resumir em uma frase: AI Agent bom não é o que "parece inteligente", mas o que opera dentro de um desenho seguro, mensurável e útil para o negócio. O futuro pertence a quem transformar IA em processo confiável, não em demo impressionante.

Checklist final para qualquer implantação:

- problema real e frequente
- dados de entrada minimamente organizados
- ferramenta ou ação clara no fim do fluxo
- critério explícito de escalonamento humano
- logs e métricas de desempenho
- revisão quinzenal no início da operação

Se esses seis itens existirem, o projeto já começa no terreno certo.`
  },
  {
    title: 'Power BI, Copilot e camada semântica: como sair do dashboard e chegar à decisão',
    excerpt: 'Relatório bonito não basta. Este artigo mostra como combinar modelagem, DAX, camada semântica e recursos de IA para transformar Power BI em plataforma de decisão, e não apenas de visualização.',
    readTime: '13 min',
    tags: ['Power BI', 'Copilot', 'Business Intelligence', 'DAX'],
    createdAt: new Date('2026-04-02T10:35:00.000Z'),
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    content: `Um dos maiores problemas em BI não é falta de painel. É excesso de painel. Empresas acumulam dashboards, páginas, filtros, gráficos e indicadores, mas continuam sem clareza sobre qual número orientar, que decisão tomar e quem deve agir depois da leitura.

Em 2026, o salto de maturidade em Business Intelligence passa por três pilares: camada semântica bem desenhada, métricas confiáveis e interfaces mais naturais de exploração, incluindo experiências com Copilot. O ponto principal, porém, continua sendo o mesmo: sem modelo certo, não existe IA que salve o relatório.

Vamos começar pela camada semântica. Em termos simples, ela é a tradução do negócio para uma estrutura analítica consistente. Em vez de cada usuário reinventar cálculos, nomes e filtros, a empresa centraliza definições: o que é faturamento líquido, o que conta como cliente ativo, como medir churn, como definir margem e como separar meta realizada de pipeline.

Quando a camada semântica é fraca, aparecem sintomas conhecidos:

- duas áreas mostram números diferentes para a mesma pergunta
- o usuário perde tempo validando o relatório antes de interpretar
- cada dashboard vira uma ilha
- o time de dados vira suporte infinito de ajuste de medida

Por outro lado, quando a camada semântica está madura, o Power BI deixa de ser um conjunto de páginas e passa a funcionar como produto analítico.

Os cinco fundamentos de uma base forte são:

1. Modelo dimensional coerente
Fatos e dimensões bem definidos ainda são a espinha dorsal do desempenho e da interpretação. Não adianta querer IA se a modelagem mistura granularidades ou replica lógica em visual.

2. Medidas oficiais
Tudo o que for estratégico deve estar encapsulado em medidas versionadas, revisadas e nomeadas com linguagem de negócio.

3. Dicionário de métricas
Cada KPI precisa responder: o que mede, como calcula, com que frequência atualiza, quem é dono e que decisão suporta.

4. Hierarquia de consumo
Executivo precisa de decisão. Gestor precisa de diagnóstico. Operação precisa de ação. O mesmo dado não deve ser apresentado da mesma forma para todos.

5. Governança de publicação
Sem padrão de workspace, homologação, permissão e ownership, o ambiente vira desorganizado rapidamente.

E onde entra o Copilot? O valor dele não está em "fazer gráficos sozinho". O valor está em reduzir atrito entre pergunta e insight. Quando o modelo está preparado, recursos conversacionais ajudam a:

- resumir variações relevantes
- sugerir explorações
- montar fórmulas iniciais
- acelerar descoberta de anomalias
- reduzir dependência de navegação manual complexa

Mas existe um ponto que pouca gente fala: Copilot não substitui critério analítico. Ele acelera exploração, não substitui modelagem, governança e interpretação.

Um erro comum é tentar usar IA sobre um relatório desorganizado. O resultado costuma ser plausível, mas pouco confiável. A ordem certa é:

primeiro organizar o dado
depois consolidar métricas
depois desenhar a jornada de leitura
só então aplicar recursos de IA para acelerar consumo

Se o objetivo é decisão, seu dashboard precisa responder quatro perguntas sem esforço:

- o que aconteceu?
- por que aconteceu?
- onde agir primeiro?
- qual é a próxima melhor ação?

Grande parte dos painéis para na primeira pergunta. Alguns chegam na segunda. Poucos ajudam de verdade na terceira e na quarta. É exatamente nessa passagem que BI de alto nível se diferencia.

Veja um exemplo simples de estrutura:

Nível 1: visão executiva
Poucos indicadores, tendência, comparativo com meta, alertas e resumo de variação.

Nível 2: diagnóstico gerencial
Análise por canal, produto, equipe, região, carteira ou etapa do funil.

Nível 3: ação operacional
Lista priorizada de itens críticos, clientes em risco, pedidos atrasados, contratos sem renovação e contas a receber vencidas.

Quando você conecta esses níveis, o BI para de ser "painel para olhar" e vira "sistema para agir".

No DAX, a recomendação mais prática é fugir do improviso. Medida de negócio precisa ser clara, nomeada e testada. Algumas boas práticas:

- separar medida base de medida derivada
- evitar lógica repetida em múltiplos visuais
- usar nomes compreensíveis pelo negócio
- documentar filtros implícitos
- testar cenários de borda

Outro tema essencial em 2026 é desempenho. Ambientes com Direct Lake, modelos grandes e consultas cada vez mais conversacionais exigem disciplina. Se o relatório demora, a confiança cai. Alguns cuidados:

- reduzir colunas inutilizadas
- preservar granularidade correta
- evitar medidas excessivamente iterativas sem necessidade
- padronizar chaves e calendário
- revisar visualizações que fazem consultas pesadas sem ganho real

Agora, a parte estratégica: o melhor dashboard não é o mais bonito. É o que diminui reunião improdutiva, reduz debate sobre número errado e acelera resposta do negócio. Se o time passa meia hora discutindo de onde veio o dado, o problema não está no gráfico; está na arquitetura de informação.

Uma implementação madura de Power BI hoje precisa combinar:

- engenharia de dados confiável na origem
- modelagem analítica limpa
- métricas bem governadas
- experiência de consumo orientada à decisão
- IA como aceleradora, não como muleta

Se você quiser avaliar o nível de maturidade do seu BI, faça este teste:

1. Existe uma definição oficial para os KPIs mais importantes?
2. Dois usuários diferentes chegam ao mesmo número?
3. O painel aponta prioridade ou apenas mostra volume?
4. O time confia nos dados sem precisar validar toda semana?
5. O gestor sabe o que fazer depois de abrir o relatório?

Se a resposta for "não" para vários itens, o próximo passo não é criar mais visual. É reorganizar a base semântica.

No fim, BI excelente não é sobre ver mais dados. É sobre reduzir ambiguidade para decidir melhor. E é por isso que Power BI, DAX e Copilot só entregam valor máximo quando trabalham em cima de uma camada semântica pensada como ativo estratégico do negócio.`
  },
  {
    title: 'Data Engineering para IA: lakehouse, contratos de dados e observabilidade sem romantização',
    excerpt: 'IA boa depende de dado confiável. Entenda como estruturar pipelines, qualidade, contratos de dados e monitoramento para suportar analytics e agentes de IA sem apagar incêndio todo dia.',
    readTime: '15 min',
    tags: ['Data Engineering', 'ETL', 'Lakehouse', 'Observabilidade'],
    createdAt: new Date('2026-03-18T09:15:00.000Z'),
    imageUrl: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=1200&q=80',
    content: `Toda empresa quer usar IA, mas poucas estão preparadas para a conversa menos glamourosa e mais importante do projeto: engenharia de dados. Sem pipeline confiável, documentação mínima, contratos de dado e monitoramento, a IA vira apenas uma camada cara em cima de informação inconsistente.

Em 2026, a pressa para colocar modelos e agentes em produção está fazendo muita organização descobrir, da pior forma, que analytics e IA não escalam sobre planilhas soltas, nomes ambíguos, fontes contraditórias e ETL improvisado.

O primeiro conceito que precisa ficar claro é este: dado para IA não é apenas volume. É disponibilidade com contexto, consistência e rastreabilidade.

Quando a base é ruim, os sintomas aparecem rápido:

- respostas contraditórias entre sistemas
- relatórios que mudam sem explicação
- prompts cada vez maiores para compensar falta de estrutura
- agente que decide com base em informação vencida
- time operacional desconfiando de tudo

Por isso, engenharia de dados moderna precisa ser vista como sistema de confiança. E três componentes ganharam protagonismo:

1. Lakehouse pragmática
O valor da abordagem lakehouse não está no hype. Está em aproximar flexibilidade de armazenamento e consumo analítico com menos fricção entre ingestão, transformação e exploração. O ponto principal não é "ter lakehouse", mas ter camadas claras.

Uma estrutura simples e eficaz:

- bronze: dado bruto, histórico, sem embelezamento
- silver: dado tratado, padronizado, deduplicado e validado
- gold: tabelas prontas para negócio, BI e produtos de dados

Se você mistura tudo na mesma camada, perde auditoria. Se exagera na complexidade cedo demais, trava a entrega. O ideal é maturidade incremental.

2. Contratos de dados
Contrato de dados é um acordo explícito sobre formato, significado, frequência, ownership e expectativa de qualidade de uma fonte. Em outras palavras: o produtor deixa de jogar dado para o consumidor se virar.

Um contrato minimamente útil deve dizer:

- qual tabela ou evento será entregue
- quais campos são obrigatórios
- tipo e formato esperado
- regra de atualização
- limite aceitável de nulos, duplicidade e atraso
- dono técnico e dono de negócio

Sem contrato, cada mudança na origem quebra vários consumidores em cadeia.

3. Observabilidade
Monitorar só "job rodou ou falhou" não basta mais. Pipeline pode terminar com sucesso e ainda assim entregar lixo. Observabilidade de dados precisa olhar:

- freshness: o dado chegou no horário esperado?
- volume: chegou muito menos ou muito mais que o normal?
- schema: algum campo mudou sem alinhamento?
- distribuição: os valores se comportam como esperado?
- lineage: quem depende dessa tabela?

Esse tipo de visibilidade reduz tempo de descoberta, evita erro silencioso e muda a postura do time de reativa para preventiva.

Agora, a parte prática: como montar uma base que aguente BI e IA ao mesmo tempo?

Passo 1: mapear sistemas críticos
Não comece querendo integrar tudo. Escolha as fontes que sustentam receita, operação, atendimento ou decisão executiva.

Passo 2: definir chave e granularidade
Boa parte do caos analítico vem de tabelas sem chave clara ou misturando níveis diferentes no mesmo dataset.

Passo 3: estabelecer testes mínimos
Exemplos: unicidade, não nulo, referência válida, range esperado e atraso máximo.

Passo 4: padronizar nomenclatura e datas
Campo inconsistente gera retrabalho desnecessário em SQL, BI e aplicações.

Passo 5: versionar transformações
Se a lógica muda, isso precisa ser rastreável. Engenharia madura não vive de ajuste invisível em produção.

Passo 6: separar consumo operacional de analítico
Nem toda tabela transacional deve ser consultada diretamente por dashboard, relatório ou agente.

Um tema negligenciado é custo. Pipelines ruins não só quebram mais: eles custam mais. Query pesada, retrabalho manual, reconciliação constante, armazenamento sem critério e incidentes frequentes comem margem de forma silenciosa. É por isso que organizar dados não é apenas tema técnico. É agenda financeira.

Quando entra IA generativa ou agentes, a exigência aumenta. O modelo precisa de contexto confiável. Se a fonte estiver atrasada ou mal descrita, a resposta pode até soar convincente, mas será operacionalmente perigosa. Em outras palavras: qualidade de dado vira controle de risco da IA.

Uma boa arquitetura para empresas em crescimento costuma combinar:

- ingestão automatizada por APIs, banco, arquivos ou webhooks
- transformação padronizada em camadas
- storage preparado para histórico e reprocessamento
- tabelas analíticas orientadas a negócio
- exposição controlada para BI, APIs e agentes

No dia a dia, alguns hábitos fazem enorme diferença:

- cada pipeline tem dono
- cada tabela importante tem descrição
- incidentes relevantes viram aprendizado permanente
- anomalias geram alerta antes de virar erro no dashboard
- mudanças na origem passam por comunicação mínima

Se você está em uma operação menor, não precisa esperar stack perfeita para agir. É totalmente possível começar bem usando Python, SQL, jobs agendados, logs consistentes e alguns testes simples. O que importa é disciplina de desenho, não fetiche por ferramenta.

Um bom time de dados hoje precisa equilibrar três compromissos:

velocidade para entregar
clareza para sustentar
qualidade para escalar

Quando um desses lados domina sozinho, surgem distorções. Só velocidade gera bagunça. Só controle gera lentidão. Só qualidade teórica sem entrega gera irrelevância.

Se eu tivesse que deixar um framework rápido para avaliar maturidade, seria este:

Nível 1 - artesanal
Extrações manuais, ajustes frequentes e baixa confiança.

Nível 2 - automatizado sem governança
Jobs existem, mas quebram com facilidade e dependem de conhecimento concentrado.

Nível 3 - confiável para BI
Camadas mais claras, métricas oficiais e menos divergência.

Nível 4 - pronto para IA operacional
Observabilidade, contratos, lineage e contexto confiável para agentes e copilotos.

No fim, engenharia de dados não aparece tanto quanto um dashboard bonito ou um agente que fala bem. Mas é ela que decide se o sistema entrega valor com consistência ou se vira mais uma promessa fraca. Quem organiza dado primeiro constrói vantagem real depois.`
  }
];

async function run() {
  await mongoose.connect(MONGODB_URI);

  const owner = await User.findOne({ email: ADMIN_OWNER_EMAIL }) || await User.findOne();
  if (!owner) {
    throw new Error('Nenhum usuario encontrado para associar os posts.');
  }

  const titlesToDelete = [...oldSampleTitles, ...legacyFeaturedTitles].filter(
    (title) => !featuredPosts.some((post) => post.title === title)
  );

  const postsToDelete = await Post.find({ title: { $in: titlesToDelete } }, { _id: 1 });
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
