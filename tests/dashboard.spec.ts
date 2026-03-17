import { test, expect } from '@playwright/test';

test.describe('AL Work OS - Automação de Login e Dashboard', () => {
  const URL = 'http://localhost:3003';
  const EMAIL = 'adrianolengruber@hotmail.com';
  const PASSWORD = 'AL_Password_2026';

  test('Deve logar com a conta Lengruber e verificar o carregamento do Dashboard', async ({ page }) => {
    // 1. Navegar para a página de login
    await page.goto(`${URL}/login`);
    
    // 2. Preencher formulário de login (usando placeholder para maior precisão)
    await page.getByPlaceholder('seu@email.com').fill(EMAIL);
    await page.getByPlaceholder('••••••••').fill(PASSWORD);
    
    // 3. Clicar no botão de login
    await page.getByRole('button', { name: /Entrar|Acessar|Login/i }).click();
    
    // 4. Verificar se redirecionou para o Dashboard (pode levar um tempo se a rede estiver lenta)
    await expect(page).toHaveURL(/.*admin/, { timeout: 15000 });
    
    // 5. Verificar se elementos chave do dashboard aparecem
    await expect(page.getByRole('heading', { name: 'Business Insights' })).toBeVisible();
    
    // 6. Verificar se o gráfico de receita está presente
    const chart = page.locator('.recharts-responsive-container').first();
    await expect(chart).toBeVisible();
    
    // 7. Verificar se os dados do MongoDB foram carregados (pelo menos um KPI deve estar preenchido)
    const kpiValue = page.locator('h3').first();
    await expect(kpiValue).not.toBeEmpty();
    
    console.log('✅ Teste de Login e Dashboard concluído com sucesso!');
  });

  test('Deve verificar se a API está respondendo corretamente via Proxy Nginx', async ({ request }) => {
    const response = await request.get(`${URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${process.env.TEST_TOKEN || ''}`
      }
    });
    
    // Se não houver token, esperamos 401, o que prova que o proxy está funcionando e o backend respondeu
    expect([200, 401]).toContain(response.status());
    console.log(`✅ API Proxy respondendo com status: ${response.status()}`);
  });
});
