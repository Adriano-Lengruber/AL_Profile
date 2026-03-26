require('dotenv').config();
const mongoose = require('mongoose');

// Conectar ao MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/al-profile-blog';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Conectado ao MongoDB para seeding...');
    
    // Modelos (simplificados para o script)
    const User = mongoose.model('User', new mongoose.Schema({ username: String }));
    
    const companySchema = new mongoose.Schema({
      name: String,
      cnpj: String,
      address: String,
      email: String,
      phone: String,
      website: String,
      bio: String,
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    });
    const Company = mongoose.model('Company', companySchema);

    const projectSchema = new mongoose.Schema({
      id: String,
      clientName: String,
      projectName: String,
      brief: String,
      status: String,
      value: Number,
      deadline: String,
      tasks: [mongoose.Schema.Types.Mixed],
      costs: [mongoose.Schema.Types.Mixed],
      stakeholders: [mongoose.Schema.Types.Mixed],
      meetingNotes: [mongoose.Schema.Types.Mixed],
      stage: { type: String, default: 'proposal' },
      nextAction: { type: String, default: '' },
      followUpDate: { type: String, default: '' },
      workflowSteps: { type: [mongoose.Schema.Types.Mixed], default: [] },
      postDeliverySteps: { type: [mongoose.Schema.Types.Mixed], default: [] },
      playbook: {
        type: mongoose.Schema.Types.Mixed,
        default: { templateId: 'consulting', steps: [] }
      },
      financials: {
        type: mongoose.Schema.Types.Mixed,
        default: { proposalValue: 0, paymentMethod: 'A definir', invoiceStatus: 'pending', installments: [] }
      },
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    });
    const Project = mongoose.model('Project', projectSchema);

    const boardItemSchema = new mongoose.Schema();
    boardItemSchema.add({
      id: String,
      name: String,
      values: mongoose.Schema.Types.Mixed,
      subitems: [boardItemSchema]
    });

    const workspaceSchema = new mongoose.Schema({
      id: String,
      name: String,
      icon: String,
      boards: [mongoose.Schema.Types.Mixed],
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    });
    const Workspace = mongoose.model('Workspace', workspaceSchema);

    // 1. Pegar o primeiro usuário
    const user = await User.findOne();
    if (!user) {
      console.error('Nenhum usuário encontrado no banco de dados. Por favor, crie um usuário primeiro.');
      process.exit(1);
    }
    const userId = user._id;
    console.log(`Semeando dados para o usuário: ${user.username} (${userId})`);

    // 2. Limpar dados existentes
    await Workspace.deleteMany({ userId });
    await Project.deleteMany({ userId });
    await Company.deleteMany({ userId });
    console.log('Dados antigos removidos.');

    // 3. Criar Empresa de Exemplo
    const sampleCompany = new Company({
      name: "Nexus Consulting Group",
      cnpj: "12.345.678/0001-90",
      address: "Av. Paulista, 1000, São Paulo - SP",
      email: "contato@nexusconsulting.com",
      phone: "(11) 98765-4321",
      website: "https://nexusconsulting.com",
      bio: "Líderes em transformação digital e inteligência de dados aplicada ao mercado financeiro e varejo.",
      userId
    });
    await sampleCompany.save();
    console.log('Empresa de exemplo criada.');

    // 4. Criar Projetos Realistas (2026)
    const sampleProjects = [
      {
        id: "p-1",
        clientName: "Global RJ Serviços",
        projectName: "Automação de ETL",
        brief: "Fluxo automatizado para extrair dados de planilhas e inserir em um banco PostgreSQL.",
        status: "active",
        value: 8500,
        deadline: "2026-04-15",
        tasks: [
          { id: "t-1", title: "Configuração do n8n", status: "done", startDate: "2026-03-05", endDate: "2026-03-10" },
          { id: "t-2", title: "Mapeamento de tabelas SQL", status: "doing", startDate: "2026-03-12" }
        ],
        costs: [{ label: "Hospedagem DigitalOcean", value: 60 }, { label: "API OpenAI", value: 150 }],
        stakeholders: [{ name: "Ricardo Santos", role: "CTO", influence: "high", preference: "clean code" }],
        meetingNotes: [{
          date: "2026-03-10",
          title: "Validação técnica da integração",
          kind: "followup",
          content: "Discussão sobre cache com Redis.",
          outcome: "Aprovado teste de performance antes da próxima entrega.",
          nextStep: "Apresentar benchmark da API e fluxo com cache."
        }],
        financials: {
          proposalValue: 8500,
          paymentMethod: "Pix + transferência",
          invoiceStatus: "issued",
          installments: [
            { id: "inst-1", label: "Sinal", amount: 3500, dueDate: "2026-03-08", status: "paid" },
            { id: "inst-2", label: "Entrega parcial", amount: 2500, dueDate: "2026-03-28", status: "pending" },
            { id: "inst-3", label: "Entrega final", amount: 2500, dueDate: "2026-04-15", status: "pending" }
          ]
        },
        postDeliverySteps: [
          { id: "testimonial", title: "Solicitar depoimento do cliente", area: "testimonial", done: false },
          { id: "case", title: "Transformar o projeto em case", area: "case", done: false },
          { id: "portfolio", title: "Atualizar portfólio e landing pessoal", area: "portfolio", done: false },
          { id: "referral", title: "Pedir indicação ou ponte comercial", area: "referral", done: false },
          { id: "upsell", title: "Abrir próxima oferta ou retenção", area: "upsell", done: false }
        ],
        playbook: {
          templateId: "automation",
          steps: [
            { id: "playbook-briefing", title: "Consolidar briefing técnico e fontes de dados", description: "Transformar dores do cliente em fluxo operacional validado.", done: true },
            { id: "playbook-stack", title: "Definir stack, ambiente e segurança do fluxo", description: "Fechar n8n, banco, credenciais, observabilidade e backups.", done: true },
            { id: "playbook-mvp", title: "Entregar MVP automatizado com validação", description: "Subir primeira versão do fluxo e validar com dados reais.", done: false },
            { id: "playbook-handover", title: "Preparar handoff, treinamento e SOP final", description: "Registrar operação, uso e manutenção para o cliente.", done: false }
          ]
        },
        userId
      },
      {
        id: "p-2",
        clientName: "Clube do Café",
        projectName: "Dashboard de Assinaturas",
        brief: "Portal para acompanhamento de métricas de recorrência e churn.",
        status: "active",
        value: 12500,
        deadline: "2026-05-20",
        financials: {
          proposalValue: 12500,
          paymentMethod: "Boleto",
          invoiceStatus: "pending",
          installments: [
            { id: "inst-4", label: "Entrada", amount: 5000, dueDate: "2026-03-30", status: "pending" },
            { id: "inst-5", label: "Entrega final", amount: 7500, dueDate: "2026-05-20", status: "pending" }
          ]
        },
        postDeliverySteps: [],
        playbook: {
          templateId: "analytics",
          steps: []
        },
        userId
      },
      {
        id: "p-3",
        clientName: "Hospital Central",
        projectName: "Consultoria LGPD",
        brief: "Adequação completa às normas de proteção de dados.",
        status: "prospect",
        value: 15000,
        deadline: "A definir",
        financials: {
          proposalValue: 15000,
          paymentMethod: "A definir",
          invoiceStatus: "pending",
          installments: []
        },
        postDeliverySteps: [],
        playbook: {
          templateId: "consulting",
          steps: []
        },
        userId
      },
      {
        id: "p-4",
        clientName: "Nexus Corp",
        projectName: "Automação de Marketing",
        brief: "Workflows inteligentes para nutrição de leads via IA.",
        status: "finished",
        value: 9200,
        deadline: "2026-03-01",
        financials: {
          proposalValue: 9200,
          paymentMethod: "Pix",
          invoiceStatus: "paid",
          installments: [
            { id: "inst-6", label: "Sinal", amount: 4600, dueDate: "2026-01-15", status: "paid" },
            { id: "inst-7", label: "Entrega final", amount: 4600, dueDate: "2026-03-01", status: "paid" }
          ]
        },
        postDeliverySteps: [
          { id: "testimonial", title: "Solicitar depoimento do cliente", area: "testimonial", done: true },
          { id: "case", title: "Transformar o projeto em case", area: "case", done: false },
          { id: "portfolio", title: "Atualizar portfólio e landing pessoal", area: "portfolio", done: false },
          { id: "referral", title: "Pedir indicação ou ponte comercial", area: "referral", done: false },
          { id: "upsell", title: "Abrir próxima oferta ou retenção", area: "upsell", done: false }
        ],
        playbook: {
          templateId: "retainer",
          steps: [
            { id: "playbook-scope", title: "Definir escopo mensal e SLAs", description: "Alinhar entregas recorrentes, limites e prioridades.", done: true },
            { id: "playbook-backlog", title: "Organizar backlog e agenda mensal", description: "Separar melhorias, correções e oportunidades do período.", done: true },
            { id: "playbook-review", title: "Executar review e reportar valor", description: "Mostrar resultado, horas, impacto e próximos passos.", done: true },
            { id: "playbook-renewal", title: "Abrir renovação, upsell e expansão", description: "Transformar operação recorrente em conta crescente.", done: false }
          ]
        },
        userId
      },
      {
        id: "p-5",
        clientName: "RetailStore",
        projectName: "Análise de Dados Marketing",
        brief: "Dashboard de performance para campanhas de Ads.",
        status: "prospect",
        value: 5000,
        deadline: "A definir",
        financials: {
          proposalValue: 5000,
          paymentMethod: "A definir",
          invoiceStatus: "pending",
          installments: []
        },
        postDeliverySteps: [],
        playbook: {
          templateId: "consulting",
          steps: []
        },
        userId
      }
    ];
    await Project.insertMany(sampleProjects);
    console.log(`${sampleProjects.length} projetos criados.`);

    // 5. Criar Workspaces e Boards
    const sampleWorkspaces = [
      {
        id: "ws-growth",
        name: "Crescimento & Vendas",
        icon: "TrendingUp",
        userId,
        boards: [
          {
            id: "board-crm",
            name: "Funil de Vendas (CRM)",
            description: "Gestão de leads e oportunidades de negócio.",
            columns: [
              { id: "stage", title: "Etapa Funil", type: "status", width: 140 },
              { id: "dealValue", title: "Valor Estimado", type: "number", width: 130 },
              { id: "priority", title: "Prioridade", type: "priority", width: 120 }
            ],
            groups: [
              {
                id: "g-leads",
                title: "Novos Leads",
                color: "#579BFC",
                items: [
                  { id: "l1", name: "Imobiliária HighEnd", values: { stage: "Qualificação", dealValue: 15000, priority: "Alta" } },
                  { id: "l3", name: "Escola de Idiomas", values: { stage: "Lead", dealValue: 5000, priority: "Média" } }
                ]
              }
            ]
          }
        ]
      },
      {
        id: "ws-delivery",
        name: "Operações & Projetos",
        icon: "Kanban",
        userId,
        boards: [
          {
            id: "board-main",
            name: "Projetos Ativos",
            columns: [
              { id: "status", title: "Status", type: "status", width: 140 },
              { id: "budget", title: "Orçamento", type: "number", width: 130 }
            ],
            groups: [
              {
                id: "g-dev",
                title: "Em Desenvolvimento",
                color: "#00C875",
                items: [
                  { id: "i1", name: "Automação ETL - Global RJ", values: { status: "Trabalhando nisso", budget: 8500 } }
                ]
              }
            ]
          }
        ]
      }
    ];
    await Workspace.insertMany(sampleWorkspaces);
    console.log(`${sampleWorkspaces.length} workspaces criados.`);

    console.log('Database Admin Work OS zerado e populado com sucesso!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Erro ao semear banco de dados:', err);
    process.exit(1);
  });
