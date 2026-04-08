import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminDashboard from '../pages/AdminDashboard';

// Mock dos ícones para evitar erros de renderização
vi.mock('lucide-react', async () => {
  const actual = await vi.importActual('lucide-react');
  return {
    ...actual,
    Trash2: (props: any) => <span data-testid="trash-icon" {...props}>Trash2</span>,
    Plus: (props: any) => <span data-testid="plus-icon" {...props}>Plus</span>,
  };
});

// Mock do window.confirm
window.confirm = vi.fn(() => true);

// Mock do fetch global
global.fetch = vi.fn();

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    user: {
      id: 'owner-1',
      username: 'admin',
      email: 'admin@teste.com',
      avatar: '',
      bio: '',
      adminAccess: {
        canAccessAdmin: true,
        isOwner: true,
        ownerId: 'owner-1',
        role: 'owner',
        permissions: {
          dashboardView: true,
          crmView: true,
          projectsView: true,
          projectsEdit: true,
          workspacesView: true,
          workspacesEdit: true,
          companyView: true,
          companyEdit: true,
          financeView: true,
          postsEdit: true,
          serverView: true,
          teamManage: true
        }
      }
    },
    token: 'token-teste',
    isAuthenticated: true,
    loading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    updateUser: vi.fn()
  })
}));

describe('AdminDashboard - Funcionalidades de Exclusão', () => {
  const renderDashboard = () => render(
    <MemoryRouter>
      <AdminDashboard />
    </MemoryRouter>
  );

  const mockWorkspaces = [
    {
      id: 'ws-1',
      name: 'Workspace Teste',
      icon: 'Layout',
      boards: [
        {
          id: 'b-1',
          name: 'Board Teste',
          description: 'Desc',
          columns: [{ id: 'c1', title: 'Status', type: 'status', width: 100 }],
          groups: [
            {
              id: 'g-1',
              title: 'Grupo Teste',
              color: '#ff0000',
              items: [{ id: 'i-1', name: 'Item Teste', values: {} }]
            }
          ]
        }
      ]
    }
  ];

  const mockProjects = [
    {
      id: 'p-1',
      clientName: 'Cliente Teste',
      projectName: 'Projeto Teste',
      status: 'prospect',
      deadline: '2026-12-31',
      brief: 'Briefing teste',
      stakeholders: [{ name: 'Stakeholder 1', role: 'CEO', influence: 'high' }],
      tasks: [],
      meetingNotes: [],
      documents: []
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // Simula resposta da API para carregamento inicial
    (global.fetch as any).mockImplementation((url: string) => {
      if (url.includes('/workspaces')) return Promise.resolve({ ok: true, json: async () => mockWorkspaces });
      if (url.includes('/projects')) return Promise.resolve({ ok: true, json: async () => mockProjects });
      if (url.includes('/company')) return Promise.resolve({ ok: true, json: async () => ({ name: 'Empresa Teste' }) });
      return Promise.resolve({ ok: true, json: async () => ({}) });
    });
  });

  it('deve chamar a API de exclusão ao remover um workspace', async () => {
    renderDashboard();
    
    // Espera os dados carregarem
    await waitFor(() => {
      expect(screen.getByText('Workspace Teste')).toBeInTheDocument();
    });

    const deleteBtn = screen.getByTitle('Remover Workspace');
    fireEvent.click(deleteBtn);

    expect(window.confirm).toHaveBeenCalledWith(expect.stringContaining('remover este workspace'));
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/workspaces/ws-1'),
      expect.objectContaining({ method: 'DELETE' })
    );
  });

  it('deve chamar a API de exclusão ao remover um item do board', async () => {
    renderDashboard();
    
    // Espera os dados carregarem e seleciona o board
    await waitFor(() => {
      expect(screen.getByText('Board Teste')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Board Teste'));

    // Espera o board carregar na área principal
    await waitFor(() => {
      expect(screen.getByDisplayValue('Item Teste')).toBeInTheDocument();
    });

    const deleteItemBtn = screen.getByTitle('Excluir Item');
    fireEvent.click(deleteItemBtn);

    expect(window.confirm).toHaveBeenCalledWith(expect.stringContaining('remover este item'));
    // A exclusão de item usa PUT no workspace no código atual
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/workspaces/ws-1'),
      expect.objectContaining({ method: 'PUT' })
    );
  });

  it('deve chamar a API de exclusão ao remover um grupo do board', async () => {
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByText('Board Teste')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Board Teste'));

    await waitFor(() => {
      expect(screen.getByText('Grupo Teste')).toBeInTheDocument();
    });

    const deleteGroupBtn = screen.getByTitle('Remover Grupo');
    fireEvent.click(deleteGroupBtn);

    expect(window.confirm).toHaveBeenCalledWith(expect.stringContaining('Remover este grupo'));
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/workspaces/ws-1'),
      expect.objectContaining({ method: 'PUT' })
    );
  });

  it('deve chamar a API de exclusão ao remover um projeto no CRM', async () => {
    renderDashboard();
    
    // Espera os dados carregarem
    await waitFor(() => {
      expect(screen.getByText('CRM & Clientes')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('CRM & Clientes'));

    // Espera o projeto aparecer
    await waitFor(() => {
      expect(screen.getByText('Cliente Teste')).toBeInTheDocument();
    });

    const deleteBtn = await screen.findByTitle('Excluir Projeto');
    fireEvent.click(deleteBtn);

    expect(window.confirm).toHaveBeenCalledWith(expect.stringContaining('remover este projeto'));
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/projects/p-1'),
      expect.objectContaining({ method: 'DELETE' })
    );
  });

  it('deve chamar a API de atualização ao alterar o valor de uma célula no board', async () => {
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByText('Board Teste')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Board Teste'));

    // Espera o input aparecer e ter o valor inicial
    let input: HTMLInputElement;
    await waitFor(() => {
      input = screen.getByDisplayValue('Item Teste') as HTMLInputElement;
      expect(input).toBeInTheDocument();
    });

    // Agora ativamos os timers fakes para o debounce
    vi.useFakeTimers();

    fireEvent.change(input!, { target: { value: 'Item Alterado' } });

    // Avança o timer do debounce (2 segundos no código)
    vi.advanceTimersByTime(2500);

    // Voltamos para timers reais para o waitFor funcionar
    vi.useRealTimers();
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/workspaces/ws-1'),
        expect.objectContaining({ 
          method: 'PUT',
          body: expect.stringContaining('Item Alterado')
        })
      );
    });
  });

  it('deve chamar a API de criação ao salvar uma proposta como projeto', async () => {
    renderDashboard();
    
    // Espera o carregamento inicial e clica na aba de propostas
    const tabBtn = await screen.findByRole('button', { name: /Propostas & Vendas/i });
    fireEvent.click(tabBtn);

    // Preenche dados da proposta - usa findBy para aguardar a renderização da aba
    const nameInput = await screen.findByPlaceholderText('Ex: Tech Corp');
    fireEvent.change(nameInput, { target: { value: 'Novo Cliente' } });

    const briefInput = screen.getByPlaceholderText(/Cole aqui o texto enviado pelo cliente/i);
    fireEvent.change(briefInput, { target: { value: 'Briefing do novo projeto' } });

    // Seleciona um módulo
    const moduleItem = screen.getByText(/Automação n8n/i);
    fireEvent.click(moduleItem);

    // Clica em "Visualizar Proposta" (Preview)
    const generateBtn = screen.getByText(/Visualizar Proposta/i);
    fireEvent.click(generateBtn);

    // Na modal de preview, espera o título e clica em "Salvar e Finalizar"
    await screen.findByText(/Preview da Proposta/i);
    const saveBtn = screen.getByRole('button', { name: /Salvar e Finalizar/i });
    
    // Ativamos timers fakes para o debounce de sync de projetos
    vi.useFakeTimers();
    
    fireEvent.click(saveBtn);

    // Avança o timer do debounce
    vi.advanceTimersByTime(2500);

    // Voltamos para timers reais
    vi.useRealTimers();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/projects/p-'),
        expect.objectContaining({ 
          method: 'PUT',
          body: expect.stringContaining('Novo Cliente')
        })
      );
    });
  });
});
