const mongoose = require('mongoose');

async function runSeed() {
  try {
    const User = mongoose.model('User');
    const Company = mongoose.model('Company');
    const Project = mongoose.model('Project');
    const Workspace = mongoose.model('Workspace');
    const Post = mongoose.model('Post');

    const user = await User.findOne({ email: 'adrianolengruber@hotmail.com' });
    if (!user) {
      console.error('Usuário Lengruber não encontrado para seed.');
      return;
    }

    const userId = user._id;

    const sampleCompany = {
      name: 'Adriano Lengruber Consultoria',
      cnpj: '00.000.000/0001-00',
      address: 'Rio de Janeiro, RJ',
      email: 'adrianolengruber@hotmail.com',
      phone: '(21) 99999-0000',
      website: 'https://adriano-lengruber.com',
      bio: 'Consultoria em automação, software e analytics aplicada a operações digitais.',
      bankInfo: 'Pix e transferência sob demanda',
      userId
    };

    await Company.findOneAndUpdate(
      { userId },
      sampleCompany,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const sampleProjects = [
      {
        id: 'p-1',
        clientName: 'Global RJ Serviços',
        projectName: 'Automação de ETL',
        brief: 'Fluxo automatizado para extrair dados de planilhas e inserir em um banco PostgreSQL.',
        status: 'active',
        value: 8500,
        deadline: '2026-04-15',
        stage: 'execution',
        nextAction: 'Validar benchmark do pipeline e aprovar a próxima entrega com cache.',
        followUpDate: '2026-03-28',
        tasks: [
          { id: 't-1', title: 'Configuração do n8n', status: 'done', startDate: '2026-03-05', endDate: '2026-03-10' },
          { id: 't-2', title: 'Mapeamento de tabelas SQL', status: 'doing', startDate: '2026-03-12' }
        ],
        costs: [
          { label: 'Hospedagem DigitalOcean', value: 60 },
          { label: 'API OpenAI', value: 150 }
        ],
        stakeholders: [
          { name: 'Ricardo Santos', role: 'CTO', influence: 'high', preference: 'clean code' }
        ],
        meetingNotes: [
          {
            date: '2026-03-10',
            title: 'Validação técnica da integração',
            kind: 'followup',
            content: 'Discussão sobre cache com Redis.',
            outcome: 'Aprovado teste de performance antes da próxima entrega.',
            nextStep: 'Apresentar benchmark da API e fluxo com cache.'
          }
        ],
        workflowSteps: [
          { id: 'briefing', title: 'Briefing aprovado', area: 'diagnosis', done: true },
          { id: 'architecture', title: 'Arquitetura do fluxo', area: 'delivery', done: true },
          { id: 'implementation', title: 'Automação do MVP', area: 'delivery', done: false },
          { id: 'qa', title: 'QA e validação com dados reais', area: 'quality', done: false }
        ],
        postDeliverySteps: [
          { id: 'testimonial', title: 'Solicitar depoimento do cliente', area: 'testimonial', done: false },
          { id: 'case', title: 'Transformar o projeto em case', area: 'case', done: false },
          { id: 'portfolio', title: 'Atualizar portfólio e landing pessoal', area: 'portfolio', done: false },
          { id: 'referral', title: 'Pedir indicação ou ponte comercial', area: 'referral', done: false },
          { id: 'upsell', title: 'Abrir próxima oferta ou retenção', area: 'upsell', done: false }
        ],
        playbook: {
          templateId: 'automation',
          steps: [
            { id: 'playbook-briefing', title: 'Consolidar briefing técnico e fontes de dados', description: 'Transformar dores do cliente em fluxo operacional validado.', done: true },
            { id: 'playbook-stack', title: 'Definir stack, ambiente e segurança do fluxo', description: 'Fechar n8n, banco, credenciais, observabilidade e backups.', done: true },
            { id: 'playbook-mvp', title: 'Entregar MVP automatizado com validação', description: 'Subir primeira versão do fluxo e validar com dados reais.', done: false },
            { id: 'playbook-handover', title: 'Preparar handoff, treinamento e SOP final', description: 'Registrar operação, uso e manutenção para o cliente.', done: false }
          ]
        },
        financials: {
          proposalValue: 8500,
          paymentMethod: 'Pix + transferência',
          invoiceStatus: 'issued',
          installments: [
            { id: 'inst-1', label: 'Sinal', amount: 3500, dueDate: '2026-03-08', status: 'paid' },
            { id: 'inst-2', label: 'Entrega parcial', amount: 2500, dueDate: '2026-03-28', status: 'pending' },
            { id: 'inst-3', label: 'Entrega final', amount: 2500, dueDate: '2026-04-15', status: 'pending' }
          ]
        },
        userId
      },
      {
        id: 'p-2',
        clientName: 'Clube do Café',
        projectName: 'Dashboard de Assinaturas',
        brief: 'Portal para acompanhamento de métricas de recorrência e churn.',
        status: 'active',
        value: 12500,
        deadline: '2026-05-20',
        stage: 'delivery',
        nextAction: 'Apresentar primeira leitura de churn e cohort com recomendações.',
        followUpDate: '2026-03-27',
        workflowSteps: [
          { id: 'briefing', title: 'Escopo e métricas fechadas', area: 'diagnosis', done: true },
          { id: 'tracking', title: 'Integração das fontes', area: 'delivery', done: true },
          { id: 'dashboard', title: 'Montar dashboard executivo', area: 'delivery', done: false },
          { id: 'handover', title: 'Treinar time comercial', area: 'relationship', done: false }
        ],
        postDeliverySteps: [],
        playbook: {
          templateId: 'analytics',
          steps: [
            { id: 'playbook-kpis', title: 'Definir KPIs e objetivos da análise', description: 'Conectar métricas aos objetivos do negócio.', done: true },
            { id: 'playbook-data', title: 'Consolidar fontes e regras de dados', description: 'Mapear eventos, tabelas e qualidade da base.', done: true },
            { id: 'playbook-dashboard', title: 'Construir dashboard com insights acionáveis', description: 'Priorizar leitura executiva, alertas e drill-down.', done: false },
            { id: 'playbook-routine', title: 'Fechar cadência de revisão e decisões', description: 'Transformar relatório em rotina de gestão.', done: false }
          ]
        },
        financials: {
          proposalValue: 12500,
          paymentMethod: 'Boleto',
          invoiceStatus: 'pending',
          installments: [
            { id: 'inst-4', label: 'Entrada', amount: 5000, dueDate: '2026-03-30', status: 'pending' },
            { id: 'inst-5', label: 'Entrega final', amount: 7500, dueDate: '2026-05-20', status: 'pending' }
          ]
        },
        userId
      },
      {
        id: 'p-3',
        clientName: 'Hospital Central',
        projectName: 'Consultoria LGPD',
        brief: 'Adequação completa às normas de proteção de dados.',
        status: 'prospect',
        value: 15000,
        deadline: 'A definir',
        stage: 'proposal',
        nextAction: 'Agendar reunião final para fechar escopo e responsáveis internos.',
        followUpDate: '2026-03-26',
        workflowSteps: [
          { id: 'diagnosis', title: 'Diagnóstico de maturidade', area: 'diagnosis', done: true },
          { id: 'proposal', title: 'Proposta com escopo e riscos', area: 'commercial', done: false },
          { id: 'presentation', title: 'Apresentação para diretoria', area: 'commercial', done: false }
        ],
        postDeliverySteps: [],
        playbook: {
          templateId: 'consulting',
          steps: [
            { id: 'playbook-discovery', title: 'Conduzir discovery com contexto do cliente', description: 'Levantar cenário atual, metas e gargalos prioritários.', done: true },
            { id: 'playbook-proposal', title: 'Fechar proposta com escopo e critérios', description: 'Definir entregáveis, cronograma, riscos e premissas.', done: false },
            { id: 'playbook-diagnosis', title: 'Executar diagnóstico e recomendações', description: 'Estruturar análise, plano e prioridades do cliente.', done: false },
            { id: 'playbook-presentation', title: 'Apresentar plano e próximos passos', description: 'Converter a entrega em decisão prática e continuidade.', done: false }
          ]
        },
        financials: {
          proposalValue: 15000,
          paymentMethod: 'A definir',
          invoiceStatus: 'pending',
          installments: []
        },
        userId
      },
      {
        id: 'p-4',
        clientName: 'Nexus Corp',
        projectName: 'Automação de Marketing',
        brief: 'Workflows inteligentes para nutrição de leads via IA.',
        status: 'finished',
        value: 9200,
        deadline: '2026-03-01',
        stage: 'retention',
        nextAction: 'Abrir conversa de expansão para operação recorrente.',
        followUpDate: '2026-03-31',
        workflowSteps: [
          { id: 'scope', title: 'Escopo validado', area: 'commercial', done: true },
          { id: 'implementation', title: 'Fluxos entregues', area: 'delivery', done: true },
          { id: 'handover', title: 'Treinamento realizado', area: 'relationship', done: true }
        ],
        postDeliverySteps: [
          { id: 'testimonial', title: 'Solicitar depoimento do cliente', area: 'testimonial', done: true },
          { id: 'case', title: 'Transformar o projeto em case', area: 'case', done: false },
          { id: 'portfolio', title: 'Atualizar portfólio e landing pessoal', area: 'portfolio', done: false },
          { id: 'referral', title: 'Pedir indicação ou ponte comercial', area: 'referral', done: false },
          { id: 'upsell', title: 'Abrir próxima oferta ou retenção', area: 'upsell', done: false }
        ],
        playbook: {
          templateId: 'retainer',
          steps: [
            { id: 'playbook-scope', title: 'Definir escopo mensal e SLAs', description: 'Alinhar entregas recorrentes, limites e prioridades.', done: true },
            { id: 'playbook-backlog', title: 'Organizar backlog e agenda mensal', description: 'Separar melhorias, correções e oportunidades do período.', done: true },
            { id: 'playbook-review', title: 'Executar review e reportar valor', description: 'Mostrar resultado, horas, impacto e próximos passos.', done: true },
            { id: 'playbook-renewal', title: 'Abrir renovação, upsell e expansão', description: 'Transformar operação recorrente em conta crescente.', done: false }
          ]
        },
        financials: {
          proposalValue: 9200,
          paymentMethod: 'Pix',
          invoiceStatus: 'paid',
          installments: [
            { id: 'inst-6', label: 'Sinal', amount: 4600, dueDate: '2026-01-15', status: 'paid' },
            { id: 'inst-7', label: 'Entrega final', amount: 4600, dueDate: '2026-03-01', status: 'paid' }
          ]
        },
        userId
      }
    ];

    for (const project of sampleProjects) {
      await Project.findOneAndUpdate(
        { id: project.id, userId },
        project,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    const sampleWorkspaces = [
      {
        id: 'ws-growth',
        name: 'Crescimento & Vendas',
        icon: 'TrendingUp',
        userId,
        boards: [
          {
            id: 'board-crm',
            name: 'Funil de Vendas (CRM)',
            description: 'Gestão de leads e oportunidades de negócio.',
            columns: [
              { id: 'stage', title: 'Etapa Funil', type: 'status', width: 140 },
              { id: 'dealValue', title: 'Valor Estimado', type: 'number', width: 130 },
              { id: 'priority', title: 'Prioridade', type: 'priority', width: 120 }
            ],
            groups: [
              {
                id: 'g-leads',
                title: 'Novos Leads',
                color: '#579BFC',
                items: [
                  { id: 'l1', name: 'Imobiliária HighEnd', values: { stage: 'Qualificação', dealValue: 15000, priority: 'Alta' } },
                  { id: 'l3', name: 'Escola de Idiomas', values: { stage: 'Lead', dealValue: 5000, priority: 'Média' } }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'ws-delivery',
        name: 'Operações & Projetos',
        icon: 'Kanban',
        userId,
        boards: [
          {
            id: 'board-main',
            name: 'Projetos Ativos',
            columns: [
              { id: 'status', title: 'Status', type: 'status', width: 140 },
              { id: 'budget', title: 'Orçamento', type: 'number', width: 130 }
            ],
            groups: [
              {
                id: 'g-dev',
                title: 'Em Desenvolvimento',
                color: '#00C875',
                items: [
                  { id: 'i1', name: 'Automação ETL - Global RJ', values: { status: 'Trabalhando nisso', budget: 8500 } }
                ]
              }
            ]
          }
        ]
      }
    ];

    for (const workspace of sampleWorkspaces) {
      await Workspace.findOneAndUpdate(
        { id: workspace.id, userId },
        workspace,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    const samplePosts = [
      {
        title: 'Introdução ao Machine Learning com Python',
        excerpt: 'Fundamentos práticos para começar com modelos supervisionados usando Python e scikit-learn.',
        content: 'Machine Learning permite criar sistemas que aprendem com dados. Python se destaca pela simplicidade e pelo ecossistema de bibliotecas como pandas e scikit-learn. O primeiro passo é estruturar bons dados, dividir treino e teste e validar a performance com métricas coerentes com o objetivo do negócio.',
        imageUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop',
        author: userId,
        authorName: user.username,
        authorAvatar: user.avatar || '',
        tags: ['Machine Learning', 'Python', 'Data Science'],
        readTime: '10 min'
      },
      {
        title: 'ETL com Python: do básico ao pipeline confiável',
        excerpt: 'Como estruturar rotinas de extração, transformação e carga com foco em qualidade e observabilidade.',
        content: 'ETL bem feito não é apenas mover dados. É garantir rastreabilidade, padronização e resiliência. Um pipeline confiável precisa tratar erros, validar entradas e registrar execução. Em projetos reais, a diferença entre automação e retrabalho está justamente na observabilidade do fluxo.',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
        author: userId,
        authorName: user.username,
        authorAvatar: user.avatar || '',
        tags: ['ETL', 'Python', 'Data Engineering'],
        readTime: '8 min'
      },
      {
        title: 'Dashboards que viram decisão',
        excerpt: 'Boas visualizações precisam responder perguntas de negócio, não só ficar bonitas.',
        content: 'Um dashboard útil organiza contexto, metas e indicadores acionáveis. Antes de pensar em gráfico, é preciso decidir quais perguntas a operação precisa responder. Quando a leitura fica clara, o dashboard deixa de ser relatório passivo e vira ferramenta de priorização para vendas, retenção e expansão.',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
        author: userId,
        authorName: user.username,
        authorAvatar: user.avatar || '',
        tags: ['Analytics', 'Dashboard', 'Business Intelligence'],
        readTime: '6 min'
      }
    ];

    for (const post of samplePosts) {
      await Post.findOneAndUpdate(
        { title: post.title },
        post,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    console.log('Seed de dados iniciais concluído com sucesso!');
  } catch (error) {
    console.error('Erro ao executar seed:', error);
  }
}

module.exports = { runSeed };
