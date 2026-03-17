const mongoose = require('mongoose');

async function runSeed() {
  try {
    // Modelos (usando os já registrados no Mongoose)
    const User = mongoose.model('User');
    const Company = mongoose.model('Company');
    const Project = mongoose.model('Project');
    const Workspace = mongoose.model('Workspace');

    // 1. Pegar o usuário Lengruber
    const user = await User.findOne({ email: 'adrianolengruber@hotmail.com' });
    if (!user) {
      console.error('Usuário Lengruber não encontrado para seed.');
      return;
    }
    const userId = user._id;

    // 2. Limpar dados existentes (apenas se for seed forçado ou se estiver vazio)
    // No index.js já verificamos se está vazio, então aqui apenas inserimos
    
    // 3. Criar Empresa
    const sampleCompany = new Company({
      name: "Adriano Lengruber Consultoria",
      cnpj: "00.000.000/0001-00",
      address: "Rio de Janeiro, RJ",
      email: "adrianolengruber@hotmail.com",
      userId
    });
    await sampleCompany.save();

    // 4. Projetos
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
        meetingNotes: [{ date: "2026-03-10", content: "Discussão sobre cache com Redis." }],
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
        clientName: "Nexus Corp",
        projectName: "Automação de Marketing",
        brief: "Workflows inteligentes para nutrição de leads via IA.",
        status: "finished",
        value: 9200,
        deadline: "2026-03-01",
        userId
      }
    ];
    await Project.insertMany(sampleProjects);

    // 5. Workspaces
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

    console.log('Seed de dados iniciais concluído com sucesso!');
  } catch (error) {
    console.error('Erro ao executar seed:', error);
  }
}

module.exports = { runSeed };
