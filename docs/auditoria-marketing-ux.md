# Auditoria de marketing, confiança e experiência — site Just Go Market

Data: 31/10/2026 · Base: branch `ccr-99b0a40c-lnq151` (site + `/apresentacao`)
Método: leitura de todas as páginas como um síndico/conselheiro de condomínio de alto padrão veria,
estrutura de mensagens (títulos, CTAs, provas), capturas desktop/mobile, Estratégia de Marca (Drive).

---

## 1. Diagnóstico em uma frase

O site já **parece** premium (identidade, tipografia, renders, curadoria), mas ainda **não prova** que é confiável
nem dá ao síndico um motivo para agir **agora**. Faltam três coisas: rostos e dados da empresa, um gancho de
entrada de baixo compromisso e uma narrativa que leve do "entendi" ao "quero" na ordem certa.

## 2. Quem decide e o que precisa ouvir

| Público | Papel | Medo principal | O que precisa ver para avançar |
|---|---|---|---|
| **Síndico** | Leva a proposta | "Vai dar trabalho e problema para mim" | Zero gestão, responsabilidade clara por escrito, material pronto para a assembleia |
| **Conselho / assembleia** | Aprova | "Quem são essas pessoas? E se der errado?" | Empresa real (CNPJ, sócios), contrato, saída, segurança, projeto visual |
| **Administradora** | Influencia vários prédios | Risco jurídico e reputacional | Modelo de contrato, seguro, responsabilidade civil |
| **Morador** | Pressiona o síndico | "Vai ser caro? Vai ser feio?" | Preço justo, marcas que conhece, estética, facilidade |
| **Incorporadora** | Inclui no projeto | Prazo e especificação técnica | Caderno técnico, cases de projeto, prazos |

Hoje o site fala muito bem com o **morador** (desejo) e razoavelmente com o **síndico** (modelo).
Fala pouco com o **conselho e a administradora**, que são quem trava ou aprova.

## 3. Lacunas de confiança (as mais caras)

1. **Ninguém assina a empresa.** Não há fundadores, equipe, fotos ou trajetória em *Sobre*. Em compra B2B sem
   histórico, rosto é a principal prova. → Seção "Quem está por trás" com 2–3 pessoas, nome, foto e frase.
2. **Sem dados institucionais.** Rodapé sem CNPJ, razão social e endereço. Conselheiros pesquisam isso antes da
   assembleia. → Adicionar ao rodapé e ao Schema.
3. **Promessas de segurança acima do comprovado.** "Câmeras 24h acompanhadas remotamente", "seguro próprio",
   "adega com trava e verificação de maioridade", "estorno na hora", "relatório mensal" e "O risco é nosso" não
   estão no MVP da plataforma. Se um conselheiro perguntar "qual seguradora?", a credibilidade cai inteira.
   → Confirmar cada item ou reescrever como "previsto em contrato".
4. **Sem prova social possível (ainda).** Não há lojas. Em vez de esconder, transformar em vantagem: ver o gancho
   *Condomínio Fundador* (§5).
5. **"Preços alinhados à conveniência premium"** (Para síndicos) acende o medo de preço alto no morador.
   → Trocar por política de preço clara (ex.: "preços de referência de supermercado premium da região").
6. **Blog com texto de baixa qualidade** (frases longas, números sem fonte). Um conselheiro que abrir um artigo
   pode concluir que a empresa é amadora. → Revisar os 10 artigos ou tirá-los do menu até a revisão.
7. **Compromissos de prazo e resposta** ("retorno em até 24 horas", "instalação 15–30 dias, sem obra civil")
   precisam estar no contrato-modelo, ou virar "estimativa".

## 4. Lacunas de compreensão e narrativa (UX)

**Ordem atual da home:** Hero → Manifesto → Curadoria → Como funciona → Para síndicos → Projeto → Segurança → FAQ → CTA
(≈ 12.500 px no desktop).

Problemas:
- O **manifesto** (abstrato) vem antes de explicar o produto. Quem chega frio ainda não sabe o que é.
- O **"quanto custa: nada"** — o argumento mais forte para o síndico — só aparece na 5ª dobra.
- **Não há escolha de perfil.** Síndico, morador e incorporadora caem na mesma página e precisam garimpar.
- O **diagnóstico de 2 minutos** (o melhor gancho que o site já tem) está escondido no rodapé e em *Para moradores*.
- Todos os CTAs pedem **alto compromisso** ("Agendar visita", WhatsApp). Falta um passo intermediário.
- *Projeto integrado* mostra uma imagem; os três renders premium mereciam uma galeria — é o que mais impressiona.

**Narrativa recomendada (problema → solução → prova → oferta → garantia → ação):**

1. **Hero** — o quê + para quem + resultado: *"Um mercado premium 24h dentro do seu condomínio. Sem investimento e
   sem gestão."* CTAs: **Ver como ficaria no meu prédio** (primário) · **Fazer o diagnóstico (2 min)** (secundário).
2. **Seletor de perfil** logo abaixo: Sou síndico · Sou morador · Sou incorporadora.
3. **Em três números** (faixa): R$ 0 · ≈15 m² · 24 h.
4. **Como funciona** (3 passos, 1 tela).
5. **O que o condomínio ganha** — valorização percebida, serviço que o morador pede, zero gestão, zero custo.
6. **Curadoria + faixa de marcas + serviços exclusivos** (desejo).
7. **Projeto premium** — galeria com os 3 renders.
8. **Segurança e responsabilidade** — só o que estiver confirmado + "por escrito, no contrato".
9. **Por que a Just Go** — comparativo sem citar nomes: projeto sob medida × módulo padronizado de franquia ×
   container; operação própria × licenciado; sem app × app obrigatório.
10. **Programa Condomínio Fundador** (oferta + urgência honesta).
11. **Quem está por trás** (rostos).
12. **FAQ** · **CTA final** com o Kit Assembleia.

## 5. Ganchos de marketing (do mais forte ao complementar)

| # | Gancho | Por que funciona | Esforço | Depende de decisão comercial? |
|---|---|---|---|---|
| 1 | **"Veja como ficaria no seu prédio"** — projeto 3D premium do espaço real, em até 5 dias úteis, sem custo | Entrega algo tangível e desejável antes do sim; vira peça para a assembleia | Médio (processo já existe) | Confirmar prazo e gratuidade |
| 2 | **Programa Condomínio Fundador** — primeiras 10 lojas em Brasília com adega personalizada inaugural, projeto exclusivo e prioridade de agenda | Transforma "ainda não temos lojas" em exclusividade; cria urgência real | Baixo | **Sim** (quais benefícios, quantas vagas) |
| 3 | **Kit Assembleia** (PDF + apresentação + minuta de contrato + FAQ para moradores + modelo de pauta) em troca de nome/WhatsApp | Resolve o maior trabalho do síndico; captura lead de baixo atrito | Médio | Minuta de contrato |
| 4 | **Diagnóstico de 2 minutos** no hero e em todas as páginas de síndico | Já existe; só está escondido | Baixo | Não |
| 5 | **"Quero no meu prédio"** — morador registra o condomínio; a Just Go leva a demanda ao síndico | Gera pressão social legítima e lista de prospecção | Médio | Política de privacidade (LGPD) |
| 6 | **Degustação na assembleia** — a Just Go leva uma seleção da curadoria no dia da votação | Experiência sensorial no momento da decisão | Baixo | Custo por evento |
| 7 | **Participação no faturamento / crédito para o condomínio** | Concorrentes já fazem; vira argumento financeiro para a assembleia | — | **Sim** (modelo financeiro) |

## 6. Mais premium — direção de arte e conteúdo

- **Pessoas na imagem.** Hoje só há produto e arquitetura. Público de alto padrão compra estilo de vida:
  1–2 cenas com morador (mãos, silhueta, sem rosto identificável) pegando um vinho, café às 7h.
- **Galeria do projeto** com os 3 renders e um "antes/depois" do espaço quando houver visita técnica real.
- **Selo e ícones oficiais** (já aplicados) podem virar sistema: um ícone por etapa da jornada.
- **Microcopy de confiança** junto dos CTAs: "Sem custo e sem compromisso · Resposta de uma pessoa do time · Seus
  dados não são compartilhados".
- **Página de preço para o morador**: exemplos de itens com faixa de preço (transparência = confiança).
- **Vídeo curto (15–20 s)** da jornada de compra em 3D para hero e WhatsApp — o render premium permite.

## 7. Plano de ação priorizado

**P0 — confiança (antes de prospectar)**
- [ ] Rostos e nomes dos sócios em *Sobre* e na apresentação · CNPJ/razão social/endereço no rodapé e Schema
- [ ] Confirmar ou reescrever as promessas de segurança (câmeras monitoradas, seguro, trava da adega, estorno, relatório)
- [ ] Trocar "preços alinhados à conveniência premium" por uma política de preço clara
- [ ] Definir o Programa Condomínio Fundador e o Kit Assembleia (decisão comercial)

**P1 — conversão (implementação no site)**
- [ ] Reordenar a home conforme §4 · hero com o quê + para quem · CTA "Ver como ficaria no meu prédio"
- [ ] Seletor de perfil abaixo do hero · diagnóstico promovido
- [ ] Galeria dos 3 renders premium · seção "Por que a Just Go" (comparativo)
- [ ] Captura do Kit Assembleia (formulário → WhatsApp, como o atual) · microcopy de confiança nos CTAs
- [ ] Eventos GA4 para os novos ganchos (kit_download, perfil_select, projeto_cta)

**P2 — profundidade**
- [ ] Imagens de estilo de vida · vídeo da jornada · página de preços de referência
- [ ] Revisão editorial do blog · "Quero no meu prédio" (lista de demanda)
- [ ] Depoimentos e fotos reais assim que a 1ª loja abrir (substituem os renders no hero)

## 8. O que já está bom (manter)

Identidade visual consistente e premium · tom de voz alinhado à Estratégia de Marca · curadoria e marcas bem
apresentadas · modelo "sem custo" claro em *Para síndicos* · FAQ completo por público · diagnóstico interativo ·
WhatsApp sempre a um toque · desempenho (LCP < 1 s no desktop) e acessibilidade · apresentação comercial com
QR Code real e modo PDF.
