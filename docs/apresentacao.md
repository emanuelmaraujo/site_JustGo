# Apresentação comercial — `/apresentacao`

Documento interno. Não publicado.

## Ver, apresentar e exportar

- **Local:** `npm run dev` e abra http://localhost:4321/apresentacao (ou `npm run build && npm run preview`).
- **Produção:** https://justgomarket.com.br/apresentacao, depois do merge na `main` (o deploy por FTP roda em todo push na `main`).
- **Abrir um slide direto:** `/apresentacao#5` ou `/apresentacao#curadoria`.
- **Teclado:** ← → · PageUp/PageDown (passadores de slide) · Espaço · Home/End · **F** = tela cheia.
- **Celular:** deslize na horizontal para trocar de slide; cada slide rola na vertical.
- **PDF:** imprimir a página (Ctrl/Cmd + P) → "Salvar como PDF", **com "Gráficos de fundo" ativado**. Sai 1 slide por
  página, 16:9, sem animação.
- **Sem JavaScript:** os 12 slides aparecem um abaixo do outro.
- A página é `noindex` e fica fora do sitemap: é material de apoio comercial, não uma página de busca.

## Arquivos

| Arquivo | Papel |
|---|---|
| `src/pages/apresentacao.astro` | Estrutura dos 12 slides e estilos de cada um |
| `src/lib/presentation.ts` | **Todo o texto**, com a classificação de cada afirmação em comentários |
| `src/layouts/DeckLayout.astro` | Layout sem header e rodapé; reaproveita tokens, fontes, GTM/GA4 e Schema |
| `src/components/deck/Slide.astro` | Slide (número, rótulo, tema do design system) |
| `src/components/deck/JourneyDemo.astro` | Jornada de compra: etapas + ilustração do totem com 4 estados |
| `src/components/deck/QrCode.astro` | QR Code real, gerado no build (SVG, zero JS) |
| `src/scripts/deck.ts` | Navegação, toque, tela cheia, GSAP, analytics |
| `src/styles/deck.css` | Sistema de slides: modo apresentação, sem JS, mobile, impressão |

`apresentacao/apresentacao.html` e `apresentacao/apresentacaoblack.html` ficam como **referência histórica** (não
são publicadas: a pasta está fora de `public/`). Podem ser removidas quando a nova versão for aprovada.

## Narrativa (14 slides)

01 Abertura · 02 A oportunidade · 03 A solução · 04 Jornada de compra · 05 Curadoria · 06 Marcas de referência ·
07 Serviços exclusivos · 08 Integração ao espaço · 09 Modelo operacional · 10 Segurança e suporte ·
11 Condições comerciais · 12 Implantação · 13 Perguntas · 14 Próximo passo

Identidade: logotipos e selo oficiais em SVG (Drive). Tom de voz e manifesto seguem a *Estratégia de Marca*
(Drive › JUST GO MARKET › DOCUMENTOS): moderno e claro, elegante e confiável, próximo, inspirador.

## Motion

- GSAP (já usado no site). Uma `gsap.timeline()` por slide, criada na entrada e encerrada com `progress(1).kill()` na
  saída: nenhuma animação fica rodando em slide oculto e não há listeners duplicados.
- `gsap.matchMedia()` liga/desliga as coreografias conforme "reduzir movimento", inclusive se a preferência mudar com a
  apresentação aberta.
- Só `transform`/`opacity` (e `clip-path` na revelação das fotos e traço dos SVGs). Entradas de 350–650 ms; o traço do
  símbolo na abertura e a linha do tempo da implantação vão até ~1,2 s, por serem a "assinatura" desses slides.
- Os tweens limpam as propriedades ao terminar. Sem JS, sem movimento ou na impressão, todo o conteúdo já está visível.
- Se o script não carregar em 3 s, a página volta ao modo contínuo (todo o conteúdo visível).

## Eventos de analytics (dataLayer → GTM/GA4)

| Evento | Quando | Parâmetros |
|---|---|---|
| `presentation_open` | Ao carregar | `slide_number`, `entry` (`start` ou `deep_link`) |
| `presentation_slide_view` | 1ª vez que cada slide é exibido (não repete ao voltar) | `slide_number`, `slide_id` |
| `presentation_complete` | 1ª vez que o último slide é exibido | `slides_viewed`, `slides_total` |
| `presentation_cta_click` | Clique em Agendar visita, telefone, e-mail, site ou QR | `cta`, `slide_number` |
| `presentation_whatsapp_click` | Clique no WhatsApp | `cta`, `slide_number` |

Nenhum dado pessoal é enviado. O `site.ts` não é carregado nesta página, então não há `whatsapp_click` duplicado.
**No GTM**, é preciso criar os acionadores de evento personalizado para esses nomes e as tags GA4 correspondentes
(o código só alimenta o `dataLayer`). O QR leva `utm_source=apresentacao&utm_medium=qrcode`.

## Classificação das afirmações

Não existe loja em operação, então nada na apresentação é "implementado e verificado em campo".

| Afirmação na apresentação | Classe | Base |
|---|---|---|
| Pagamento por Pix no totem | Planejado (MVP) + confirmado no site | `justgo-plataform` (Pix é o único meio do MVP); `pendencias-conteudo.md` |
| Venda só confirmada após o pagamento; estoque com lote e validade | Planejado (MVP) | `justgo-plataform`, fluxos 7.1 e 3.1 |
| R$ 0 de investimento, ≈15 m², 1 ponto de energia com consumo reembolsado, contrato de 36 meses | Compromisso comercial publicado no site | `FACTS` em `src/lib/site.ts` — **validar no contrato-modelo** |
| Reposição, limpeza, manutenção e suporte pela Just Go | Compromisso comercial publicado | `model.ts` |
| Projeto em até 5 dias úteis; instalação em 15–30 dias | Estimativa | Apresentados como "estimativa" |
| Câmeras no espaço | Pendente | Redigido como "o projeto inclui"; especificação a confirmar |
| Regras de acesso | Pendente | Apresentado como "definido pelo condomínio" |
| Venda de bebidas alcoólicas | Pendente | Apenas "política definida antes da inauguração" |

**Fora da apresentação, de propósito:** "risco zero", "controle absoluto", biometria/reconhecimento facial (fora do MVP),
cartão de crédito/débito (fora do MVP), seguro contra furtos, trava da adega com verificação de maioridade, monitoramento
24h com central, estorno na hora, relatório mensal, valorização do imóvel, números de produtos e clientes, depoimentos.

## Marcas de referência e serviços exclusivos (31/10/2026)

- **Marcas** (`src/lib/brands.ts`): definidas pela Just Go Market como padrão da curadoria. Aparecem só como nomes,
  em tipografia própria — **nunca com logotipos**, que exigem autorização de cada fabricante — e sempre com a
  ressalva "o mix de cada loja depende da disponibilidade dos distribuidores".
  Antes de divulgar amplamente, vale confirmar com os distribuidores que cada marca está acessível.
- **Serviços** (`src/lib/services.ts`): adega personalizada, mix sob medida e consultoria de curadoria.
  A mensagem original foi cortada em "consultoria com…": se a consultoria for com um especialista (ex.: sommelier),
  basta ajustar o texto nesse arquivo.

## Pendências comerciais (confirmar antes de usar a apresentação com clientes)

1. **Formas de pagamento.** O site anunciava "Pix ou cartão"; a arquitetura do MVP aceita só Pix (cartão é pós-MVP).
   O site passou a dizer só **Pix**. Se o totem aceitar cartão, basta mudar `FACTS.payment` em `src/lib/site.ts`
   (e Termos, FAQ e Schema, que listam a forma de pagamento).
2. **E-mail de contato.** O site usa `justgomarket@justgomarket.com.br`; as apresentações antigas usavam
   `contato@justgomarket.com.br`. A nova usa o do site (`SITE.email`). Confirmar qual caixa é atendida.
3. **Aplicativo:** o render da fachada diz "Baixe o app"; o site diz "sem aplicativo para comprar".
4. **Controle de acesso** (livre, QR Code, app do condomínio): quais opções existem de fato?
5. **Verificação de idade / trava da adega:** fora do MVP. O site ainda afirma (Home › Segurança, FAQ, `model.ts`).
6. **Seguro contra danos e furtos**, **monitoramento 24h** e **estorno na hora:** afirmados no site; confirmar contratação.
7. **Reembolso de energia:** medidor individual ou taxa fixa? (Para síndicos cita as duas.)
8. **Contrato:** 36 meses com renovação automática; o que acontece na rescisão?
9. **Prazos:** projeto em até 5 dias úteis e instalação em 15–30 dias (vêm do site anterior).
10. **Visita técnica sem custo:** a apresentação antiga dizia; a nova não afirma.
11. **"Sem obra civil":** o site afirma; a apresentação condiciona à visita técnica.
12. **Categoria Bem-estar:** oculta no site até ser confirmada (remova `confirm` do JSON para publicar).
13. **Créditos das fotos:** completar os autores em `docs/creditos-imagens.md`.
14. **Renders:** novas vistas em alta resolução, com embalagens genéricas.

Itens 5 e 6 seguem no site como estavam: corrigi-los significa reescrever as seções de segurança, o que é uma decisão
comercial. Ficam registrados aqui.
