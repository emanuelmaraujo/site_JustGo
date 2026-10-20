// Conteúdo do modelo de operação — reutilizado em várias páginas.
import { FACTS } from './site';
import type { IconName } from '../components/Icon.astro';

export const BUY_STEPS = [
    {
        title: 'Entre',
        text: 'Acesso livre ou por QR Code e aplicativo do condomínio. A loja fica aberta 24 horas, todos os dias.',
    },
    {
        title: 'Escolha e escaneie',
        text: 'Pegue o que precisa e passe o código de barras no totem. Sem fila, sem espera.',
    },
    {
        title: 'Pague e siga',
        text: `${FACTS.payment}, direto no totem — sem precisar de aplicativo. Em menos de dois minutos, você está de volta em casa.`,
    },
];

export const ROLLOUT = [
    {
        meta: FACTS.projectDays,
        title: 'Visita técnica e projeto',
        text: 'Avaliamos o espaço (cerca de 15 m²), a circulação e o perfil dos moradores. Em seguida, apresentamos o projeto 3D com layout, materiais e mix sugerido.',
    },
    {
        meta: 'Conforme a agenda do condomínio',
        title: 'Aprovação em assembleia',
        text: 'Entregamos o material da apresentação, os detalhes do contrato e respostas para as dúvidas dos moradores. Se for útil, acompanhamos a assembleia.',
    },
    {
        meta: FACTS.installDays,
        title: 'Instalação',
        text: 'Estrutura modular, sem obra civil: prateleiras, geladeiras, totem, câmeras e medidor de energia individual. Tudo por nossa conta.',
    },
    {
        meta: 'Dia 1',
        title: 'Inauguração',
        text: 'Estoque inaugural, comunicado aos moradores e canal de suporte ativo. A loja abre 24 horas desde o primeiro dia.',
    },
];

export const OPERATION: { icon: IconName; title: string; text: string }[] = [
    {
        icon: 'box',
        title: 'Reposição',
        text: 'Visitas periódicas para repor o estoque e ajustar o mix ao consumo real.',
    },
    {
        icon: 'wrench',
        title: 'Limpeza e manutenção',
        text: 'Higienização do espaço e manutenção preventiva de todos os equipamentos.',
    },
    {
        icon: 'camera',
        title: 'Monitoramento 24h',
        text: 'Câmeras em alta definição, armazenamento em nuvem e alertas automáticos.',
    },
    {
        icon: 'chat',
        title: 'Suporte ao morador',
        text: 'Atendimento pelo WhatsApp em tempo real, com estorno na hora quando necessário.',
    },
    {
        icon: 'doc',
        title: 'Relatório ao síndico',
        text: 'Um resumo mensal simples: funcionamento, manutenção e retorno dos moradores.',
    },
];

export const WE_DO = [
    'Investimento integral em estrutura, equipamentos e tecnologia',
    'Estoque e reposição',
    'Limpeza e manutenção',
    'Monitoramento de segurança 24h',
    'Suporte ao morador pelo WhatsApp',
    'Seguro contra danos e furtos',
    'Reembolso do consumo de energia',
    'Relatório mensal ao síndico',
];

export const CONDO_GIVES = ['Espaço de cerca de 15 m²', 'Um ponto de energia'];

export const SECURITY: { icon: IconName; title: string; text: string }[] = [
    {
        icon: 'key',
        title: 'Acesso identificado',
        text: 'O condomínio escolhe: entrada livre ou controlada por QR Code ou pelo aplicativo do condomínio. Mesmo no acesso livre, as câmeras registram cada entrada.',
    },
    {
        icon: 'camera',
        title: 'Monitoramento 24h em alta definição',
        text: 'Câmeras cobrem todo o espaço, com imagens em nuvem acompanhadas remotamente pela nossa equipe e alertas para comportamentos atípicos.',
    },
    {
        icon: 'scan',
        title: 'Rastreabilidade',
        text: 'Cada transação no totem é registrada. O inventário cruza estoque e vendas para identificar divergências, com auditorias periódicas.',
    },
    {
        icon: 'lock',
        title: 'Adega com trava',
        text: 'As geladeiras de bebidas alcoólicas só abrem após verificação de maioridade no totem ou no aplicativo. Proteção automática, sem depender de funcionário.',
    },
    {
        icon: 'shield',
        title: 'Seguro e responsabilidade',
        text: 'Contratamos e pagamos seguro contra danos e furtos. Se algo acontece, nossa equipe trata diretamente — sem envolver a administração.',
    },
];
