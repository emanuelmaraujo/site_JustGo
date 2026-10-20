# Pendências de conteúdo — redesign premium

Itens que **não foram inventados** e precisam de confirmação ou material do time Just Go Market
antes do merge. No site, aparecem marcados com `[CONFIRMAR]` ou como placeholder `[FOTO: …]`.

## Confirmado durante o projeto

- **Pix** é aceito em todos os totens. Já aplicado em todo o site (FAQ, Termos, Schema).

## Fotografia

Os nomes dos arquivos esperados estão em `docs/prompts-fotos.md`. Basta salvar em
`src/assets/fotos/<nome>.(jpg|png|webp)` — o site otimiza (AVIF/WebP) e troca o placeholder sozinho.

| Arquivo | Onde aparece | Situação |
|---|---|---|
| `hero-loja-noite` | Hero da home | Placeholder. Pode vir dos renders 3D do Drive (FACHADA / INTERIOR) |
| `projeto-interior` | Hero de Como funciona | Placeholder. Sugestão: INTERIOR 1–8 (Drive › IMAGENS 3D) |
| `projeto-fachada` | Hero de Para incorporadoras | Placeholder. Sugestão: FACHADA / FACHADA 2 (Drive) |
| `projeto-antes` / `projeto-depois` | Slider antes/depois (home) | Placeholder. Foto real de um hall antes e depois, ou par de renders |
| `curadoria-adega`, `-emporio`, `-despensa`, `-bem-estar` | Curadoria (home, Curadoria, Para moradores) | Placeholder. Prompts prontos em `docs/prompts-fotos.md` |
| `morador-adega` | Hero de Para moradores | Placeholder |
| `totem-scan` | (reserva) | Placeholder |
| `brasilia-noite` | Sobre | **Foto real** (já existia no site) |

Fotos da loja geradas por IA ou renders aparecem com a legenda **"Imagem ilustrativa"**.
A foto antiga `loja-conveniencia-autonoma-df.jpg` (homem com vinho, loja com a marca) parece gerada
por IA e simula uma loja real — **foi retirada** do site.

### Material encontrado no Google Drive (pasta "JUST GO MARKET")

- `IMAGENS 3D/` — FACHADA, FACHADA 2, INTERIOR 1–8: renders do projeto. Ideais para hero, Como funciona,
  Para incorporadoras e antes/depois. **Baixar e salvar em `drive/` na raiz do repositório** para eu integrar.
- `Lista de Produtos.pdf` — é um PDF escaneado (sem texto). Preciso dele baixado para extrair as marcas.
- `IDENTIDADE VISUAL/` — LOGOTIPO (JPG), PATTERNS, BACKGROUND (vetor .ai/PDF), MATERIAIS EXTRAS (ícones).
  O símbolo do site foi traçado sobre o arquivo oficial em alta resolução; um SVG oficial (ou o
  `Logo Sozinha.dxf`) permitiria trocar o logotipo PNG do header por vetor.

## Fatos a confirmar

- [ ] **Aplicativo:** o render da fachada diz "Baixe o app, entre e finalize sua compra", mas o site e o
      FAQ afirmam que **não é preciso aplicativo para comprar** (diferencial frente às concorrentes).
      Qual é o correto hoje? Se o app for obrigatório em algum condomínio, ajusto os textos.
- [ ] **Pagamento por aproximação** (NFC) — citar ou não.
- [ ] **Marcas premium** efetivamente vendidas — para a faixa de marcas (`PREMIUM_BRANDS` em `src/lib/site.ts`;
      com a lista vazia, a faixa não aparece).
- [ ] **Categoria Bem-estar** existe no mix atual? (`src/content/curadoria/04-bem-estar.json`)
- [ ] **Prazo de instalação** — o site usa "15 a 30 dias, sem obra civil" e "projeto em até 5 dias úteis"
      (vindos do site anterior). Confirmar.
- [ ] **Retorno em até 24 horas** com estudo de viabilidade (texto do CTA final, vindo do site anterior).
- [ ] **Material para a assembleia** — existe um PDF para download? Hoje o botão pede pelo WhatsApp.
- [ ] **Modelo comercial e especificações técnicas para incorporadoras** (página nova).
- [ ] **Depoimentos** de síndicos (nome, condomínio, cargo, com autorização). Sem depoimento real,
      a seção ficou **omitida**.
- [ ] **Condomínios atendidos** (com autorização) ou apenas os bairros.
- [ ] **Redes sociais** (Instagram etc.) para o rodapé.
- [ ] **Valparaíso de Goiás** continua na área atendida? (estava no Schema e no formulário antigos)

## Números removidos por falta de fonte

- "500+ produtos" (home, como funciona, regiões)
- "Valorização de até 3,5%" (regiões Brasília, Noroeste, Taguatinga)
- "R$ 150.000 por unidade" (quanto custa, regiões)
- "Risco zero" e "taxa de irregularidade abaixo de 2%" (segurança)

Se houver fonte, podem voltar — com a fonte citada.

## Blog

Os 10 artigos foram mantidos (URLs preservadas); só foram ajustados o H1 duplicado e os links internos.
O texto de vários artigos tem frases longas e pouco naturais, além de afirmações sem fonte
(ex.: "a resistência cai drasticamente por mais de 80%"). Recomendo uma revisão editorial.

## Domínio

O canônico é **justgomarket.com.br** (sem www). Algumas peças da apresentação usam ".com".
