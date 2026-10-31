// Conteúdo da apresentação comercial (/apresentacao).
//
// Cada afirmação traz, em comentário, a sua classificação de veracidade:
//   [C3] compromisso comercial já publicado no site (FACTS) — validar no contrato-modelo
//   [C4] funcionalidade planejada (arquitetura do MVP — justgo-plataform)
//   [C5] pendente de confirmação — redigido de forma condicional ou omitido
// Não há [C1]/[C2]: ainda não existe loja em operação. Nada aqui afirma
// condomínios atendidos, lojas inauguradas, números de vendas ou depoimentos.
// A lista completa de pendências fica em docs/apresentacao.md (uso interno).

import { FACTS, SITE, whatsappUrl } from './site';

export const DECK = {
  title: 'Apresentação comercial',
  whatsappText: 'Olá! Vi a apresentação da Just Go Market e gostaria de agendar uma visita técnica.',
  /** Destino do QR Code (página oficial de agendamento, com origem identificada no GA4). */
  qrUrl: `${SITE.url}/agendar-visita?utm_source=apresentacao&utm_medium=qrcode&utm_campaign=apresentacao_comercial`,
} as const;

export const deckWhatsappUrl = () => whatsappUrl(DECK.whatsappText);

/** Ordem e rótulos dos slides — o número vem da posição. */
export const SLIDES = [
  { id: 'abertura', label: 'Abertura' },
  { id: 'oportunidade', label: 'A oportunidade' },
  { id: 'solucao', label: 'A solução' },
  { id: 'jornada', label: 'Jornada de compra' },
  { id: 'curadoria', label: 'Curadoria' },
  { id: 'projeto', label: 'Integração ao espaço' },
  { id: 'modelo', label: 'Modelo operacional' },
  { id: 'seguranca', label: 'Segurança e suporte' },
  { id: 'condicoes', label: 'Condições comerciais' },
  { id: 'implantacao', label: 'Implantação' },
  { id: 'perguntas', label: 'Perguntas importantes' },
  { id: 'convite', label: 'Próximo passo' },
] as const;

export type SlideId = (typeof SLIDES)[number]['id'];
export const slideNumber = (id: SlideId) => SLIDES.findIndex((s) => s.id === id) + 1;

// 02 — situações cotidianas, sem números inventados
export const MOMENTS = [
  { time: '07:10', text: 'O café acabou antes do trabalho.' },
  { time: '19:40', text: 'Faltou um ingrediente para o jantar.' },
  { time: '21:15', text: 'Chegou visita e não há o que servir.' },
  { time: '23:30', text: 'Bateu vontade de um doce depois de um dia longo.' },
];

// 03 — a solução em três partes
export const SOLUTION = [
  { k: 'Espaço', text: `Cerca de ${FACTS.area} em uma área comum, com um ponto de energia.` }, // [C3]
  { k: 'Autoatendimento', text: 'O morador escolhe, lê o código de barras no totem e paga.' }, // [C4]
  { k: 'Operação', text: 'Reposição, limpeza, manutenção e suporte ficam com a Just Go Market.' }, // [C3]
];

// 04 — jornada. Pix é a única forma de pagamento confirmada [C4: "Pagamento via Pix" no MVP].
// O modo de acesso depende da escolha do condomínio [C5] — por isso "conforme a regra do condomínio".
export const JOURNEY = [
  { title: 'Entre', text: 'O acesso segue a regra definida pelo condomínio.' },
  { title: 'Escolha', text: 'Pegue o que precisa nas prateleiras e geladeiras.' },
  { title: 'Leia o código', text: 'Passe cada produto no leitor do totem.' },
  { title: 'Pague com Pix', text: 'O totem gera a cobrança. A venda é confirmada após o pagamento.' },
];

// 05 — categorias que já aparecem no site. "Bem-estar" fica de fora até ser confirmada [C5].
export const CURATION = [
  { title: 'Despensa 24h', text: 'Café, mercearia e o essencial do dia a dia.', photo: 'curadoria-despensa', alt: 'Potes de vidro com café em grãos sobre fundo escuro' },
  { title: 'Empório', text: 'Queijos, azeites e pequenos luxos.', photo: 'curadoria-emporio', alt: 'Queijo, azeite, azeitonas e uma taça de vinho sobre mesa escura' },
  { title: 'Doces e snacks', text: 'Chocolates e petiscos para qualquer hora.', photo: 'produto-chocolate', alt: 'Barra de chocolate amargo sobre superfície preta' },
  { title: 'Adega', text: 'Vinhos e espumantes selecionados.', photo: 'curadoria-adega', alt: 'Silhuetas de garrafas de vinho sobre fundo preto' },
];

// 06 — projeto. "Sem obra civil" é afirmado no site; aqui fica condicionado à visita [C5].
export const PROJECT_POINTS = [
  'Layout desenhado para a área disponível e a circulação do prédio.',
  'Estrutura modular. A necessidade de adequações é avaliada na visita técnica.',
  'Identidade visual da marca aplicada com acabamentos que conversam com a área comum.',
];

// 07 — matriz de responsabilidades [C3: WE_DO / CONDO_GIVES em model.ts]
export const RESPONSIBILITIES = {
  justgo: [
    'Investimento em estrutura, equipamentos e estoque inicial',
    'Reposição e controle de validade',
    'Limpeza do espaço e manutenção dos equipamentos',
    'Atendimento aos moradores',
    'Reembolso do consumo de energia da loja',
  ],
  condo: [
    `Cede cerca de ${FACTS.area} em área comum`,
    'Disponibiliza um ponto de energia',
    'Leva a proposta à assembleia',
    'Define a regra de acesso ao espaço',
  ],
};

// 08 — segurança. Sem "risco zero", sem "controle absoluto".
export const SAFEGUARDS = [
  { icon: 'scan', title: 'Venda registrada', text: 'Cada venda fica registrada e só é confirmada após o pagamento.' }, // [C4] fluxo de venda do MVP
  { icon: 'box', title: 'Estoque com lote e validade', text: 'O estoque é controlado por loja, com lote e validade de cada produto.' }, // [C4]
  { icon: 'camera', title: 'Câmeras no espaço', text: 'O projeto da loja inclui câmeras cobrindo a área de compra.' }, // [C5] especificação a confirmar
  { icon: 'key', title: 'Acesso definido pelo condomínio', text: 'As opções de acesso são apresentadas na proposta e escolhidas pelo condomínio.' }, // [C5]
  { icon: 'chat', title: 'Suporte ao morador', text: 'Dúvidas e problemas são tratados pela equipe da Just Go Market, pelo WhatsApp.' }, // [C3]
] as const;

// 09 — condições comerciais [C3 — FACTS]. Apresentadas como "de referência".
export const TERMS = [
  { value: FACTS.investment, label: 'Investimento do condomínio', note: 'Estrutura, equipamentos e estoque por conta da Just Go' },
  { value: `≈${FACTS.area}`, label: 'Área necessária', note: 'Em área comum, definida na visita técnica' },
  { value: '1', label: 'Ponto de energia', note: 'Consumo da loja medido e reembolsado' },
  { value: `${FACTS.contractMonths}`, unit: 'meses', label: 'Prazo de referência do contrato', note: 'Condições finais na proposta' },
];

// 10 — implantação. Prazos são estimativas, nunca garantias [C3 → validar].
export const ROLLOUT_STEPS = [
  { title: 'Conversa inicial', meta: 'Por WhatsApp ou telefone' },
  { title: 'Visita técnica', meta: 'Avaliação do espaço e da circulação' },
  { title: 'Projeto', meta: `Estimativa: ${FACTS.projectDays}` },
  { title: 'Assembleia', meta: 'Conforme a agenda do condomínio' },
  { title: 'Instalação', meta: `Estimativa: ${FACTS.installDays} após a aprovação` },
  { title: 'Inauguração', meta: 'Comunicado aos moradores e suporte ativo' },
];

// 11 — objeções
export const QUESTIONS = [
  {
    q: 'O condomínio paga alguma coisa?',
    a: 'Não há investimento do condomínio em estrutura, equipamentos ou estoque. O consumo de energia da loja é reembolsado.',
  },
  {
    q: 'Funcionários do condomínio trabalham na loja?',
    a: 'Não. Reposição, limpeza e manutenção são feitas pela equipe da Just Go Market.',
  },
  {
    q: 'É preciso fazer obra?',
    a: 'A estrutura é modular. Se o espaço precisar de alguma adequação, isso aparece na visita técnica, antes de qualquer compromisso.',
  },
  { q: 'Como o morador paga?', a: 'Por Pix, direto no totem de autoatendimento.' },
  {
    q: 'Quem resolve se algo der errado?',
    a: 'A equipe da Just Go Market atende o morador pelo WhatsApp. A administração não precisa intermediar.',
  },
  {
    q: 'E as bebidas alcoólicas?',
    a: 'A política de venda e a forma de verificação de idade são definidas com o condomínio antes da inauguração.',
  },
];
