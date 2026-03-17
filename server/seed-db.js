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

    // 4. Criar Projetos Realistas
    const sampleProjects = [
      {
        id: "p-1",
        clientName: "TechBank Brasil",
        projectName: "Redesign UX/UI Portal",
        brief: "Modernização da experiência do usuário para o portal de investimentos.",
        status: "active",
        value: 45000,
        deadline: "2024-06-15",
        tasks: [
          { id: "t-1", title: "Pesquisa de Usuários", status: "finished", startDate: "2024-03-01", endDate: "2024-03-15" },
          { id: "t-2", title: "Wireframes", status: "active", startDate: "2024-03-16", endDate: "2024-04-10" }
        ],
        costs: [{ label: "Figma Pro", value: 150 }, { label: "Consultor Sênior", value: 5000 }],
        stakeholders: [{ name: "Ricardo Silva", role: "CTO", influence: "high", preference: "modern" }],
        meetingNotes: [{ date: "2024-03-10", content: "Definição de cores primárias concluída." }],
        userId
      },
      {
        id: "p-2",
        clientName: "Global Logistics",
        projectName: "Implementação CRM",
        brief: "Integração total do fluxo de vendas com Salesforce.",
        status: "active",
        value: 28000,
        deadline: "2024-05-20",
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
        userId
      },
      {
        id: "p-4",
        clientName: "Nexus",
        projectName: "Automação Financeira",
        brief: "Internalização e automação de fluxos de caixa.",
        status: "finished",
        value: 12000,
        deadline: "2024-03-01",
        userId
      },
      {
        id: "p-5",
        clientName: "RetailStore",
        projectName: "Análise de Dados Marketing",
        brief: "Dashboard de performance para campanhas de Ads.",
        status: "prospect",
        value: 8500,
        deadline: "A definir",
        userId
      },
      {
        id: "p-6",
        clientName: "SaaS Start",
        projectName: "Migração Cloud AWS",
        brief: "Escalabilidade e redução de custos em infraestrutura.",
        status: "active",
        value: 62000,
        deadline: "2024-08-10",
        userId
      }
    ];
    await Project.insertMany(sampleProjects);
    console.log(`${sampleProjects.length} projetos criados.`);

    // 5. Criar Workspaces e Boards
    const sampleWorkspaces = [
      {
        id: "ws-1",
        name: "Pipeline Comercial",
        icon: "Target",
        userId,
        boards: [
          {
            id: "b-1",
            name: "Vendas 2024",
            description: "Acompanhamento de leads e propostas",
            columns: [
              { id: "c1", title: "Status", type: "status", width: 150 },
              { id: "c2", title: "Valor", type: "number", width: 120 },
              { id: "c3", title: "Prioridade", type: "priority", width: 100 }
            ],
            groups: [
              {
                id: "g-1",
                title: "Em Negociação",
                color: "#579BFC",
                items: [
                  { id: "i-1", name: "Proposta TechBank", values: { c1: "Em andamento", c2: 45000, c3: "Alta" } },
                  { id: "i-2", name: "Follow-up RetailStore", values: { c1: "Novo", c2: 8500, c3: "Média" } }
                ]
              }
            ]
          }
        ]
      },
      {
        id: "ws-2",
        name: "Gestão de Entregas",
        icon: "Briefcase",
        userId,
        boards: [
          {
            id: "b-2",
            name: "Projetos Ativos",
            columns: [
              { id: "c1", title: "Fase", type: "status", width: 150 },
              { id: "c2", title: "Prazo", type: "date", width: 150 }
            ],
            groups: [
              {
                id: "g-2",
                title: "Execution",
                color: "#22c55e",
                items: [
                  { id: "i-3", name: "Migração Cloud", values: { c1: "Execução", c2: "2024-08-10" } }
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
