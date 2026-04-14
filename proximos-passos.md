# Checklist de Evolução

## Prioridades imediatas

- [x] Transformar cada card de “Consultorias Especializadas” em gerador de lead real
- [x] Implementar financeiro operacional no Work OS
- [ ] Evoluir CRM + portal do cliente para follow-up, aceite e retenção
- [x] Portal do cliente com visão de follow-up, aceite, financeiro e retenção

## Landing Page

- [x] Mais conversão no topo: reduzir o HERO para 1 CTA principal comercial e 1 CTA secundário institucional
- [x] Prova social acima da dobra: incluir bloco com resultados, clientes atendidos, segmentos ou mini-cases
- [x] Consultorias com CTA por card e página dedicada por serviço
- [x] Captação mais inteligente no contato: adicionar tipo de serviço, orçamento, urgência e canal preferido
- [ ] Experiências como argumento comercial: evoluir a timeline para “Experiência + Casos + Impacto”

## Evolução da Landing

- [ ] Criar lead magnet local para diagnóstico de automação, BI ou infraestrutura
- [x] Criar uma landing dedicada para cada consultoria do carrossel
- [ ] Adicionar WhatsApp comercial fixo com mensagem pré-preenchida por serviço
- [ ] Criar seção de cases com antes/depois, stack e resultado mensurável
- [ ] Integrar agenda para agendamento direto de conversa

## Work OS

- [x] Implementar visão financeira real de caixa, competência, contas a receber e previsão por parcelas
- [ ] Substituir mock de tráfego e logs de segurança por dados reais do servidor
- [ ] Evoluir CRM com cadência automática, histórico omnichannel e “próxima melhor ação”
- [x] Adicionar SLAs, checkpoints, aprovações formais e gatilhos por atraso em Operações
- [ ] Criar trilha de auditoria para equipe, permissões e alterações sensíveis
- [x] Evoluir o portal do cliente com aprovação, entrega, fatura e assinatura
- [x] Publicar no portal cards de próxima ação, follow-up, financeiro, workflow e continuidade
- [x] Reorganizar o dashboard admin para reduzir rolagem, priorizar informações e distribuir melhor os blocos por sub-abas/atalhos

## Funcionalidades de maior impacto

### No Work OS

- [x] Receita prevista x recebida x atrasada por projeto
- [ ] Automação de follow-up com e-mail, WhatsApp e templates
- [x] Timeline única do cliente com reuniões, propostas, documentos e decisões
- [x] Alertas de SLA, atraso e risco de churn ou escopo
- [x] Aprovação de entregas e aceite formal pelo portal do cliente

### Na Landing

- [ ] Mini-cases com resultado mensurável
- [ ] Formulário de briefing rápido por serviço
- [x] CTA contextual em cada consultoria
- [x] Landing dedicada para VPS, Workstation, BI Express e Personal Developer
- [ ] Bloco de autoridade com stack, clientes, setores e diferenciais competitivos

## Referências atuais

- Landing Page
  - App.tsx:L263-L279
  - App.tsx:L341-L357
  - App.tsx:L681-L755
  - App.tsx:L870-L943
  - App.tsx:L1345-L1356
- Work OS
  - AdminDashboard.tsx:L1304-L1499
  - AdminDashboard.tsx:L1512-L1558
  - AdminDashboard.tsx:L3728-L3865
  - AdminDashboard.tsx:L3870-L3984
  - AdminDashboard.tsx:L5019-L5184
  - ClientPortal.tsx:L132-L197
  - ClientPortal.tsx:L279-L573
  - server/index.js:L203-L290
  - server/index.js:L1468-L1498
