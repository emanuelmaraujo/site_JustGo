# Prompts de fotografia — Just Go Market (site premium)

Direção: **"Galeria noturna"**. Pretos profundos, luz quente, contraste moderado,
nenhum texto ou logotipo dentro da imagem (a marca é aplicada pelo site, nunca pela IA).

## Como usar

- **ChatGPT (GPT Image):** cole o prompt inteiro em inglês. Peça a proporção indicada
  ("aspect ratio 16:9") e, se possível, a qualidade "high".
- **Gemini (Imagen / Nano Banana):** cole o prompt inteiro. Se a proporção não for respeitada,
  acrescente no início: `Wide 16:9 landscape photograph.` (ou a proporção do item).
- Gere 3–4 variações e escolha a que tiver **menos aparência de IA**: rótulos ilegíveis
  ou deformados, garrafas tortas e reflexos impossíveis são motivos para descartar.
- Envie os arquivos originais (PNG/JPG em resolução máxima). Eu converto para AVIF/WebP,
  recorto para mobile e otimizo.
- Nomeie cada arquivo com o código do item (ex.: `hero-loja-noite.png`, `curadoria-adega.png`)
  e salve em `src/assets/fotos/`. O site já procura esses nomes; enquanto o arquivo não
  existir, aparece um placeholder elegante no lugar.
- **Prioridade**, se não der para gerar todas: 1 → 2 → 3 → 4 → 9 → 6+7 → 8 → 5.

**Importante:** as fotos da loja instalada (itens 1, 6, 7) são **ilustrativas**. No site elas
aparecem com a legenda "Imagem ilustrativa" até existirem fotos reais de uma loja Just Go.
As fotos de produto (2–5) e de detalhe (8–9) não representam uma loja específica e podem
ser usadas sem legenda.

### Sufixo de estilo (já incluído em todos os prompts abaixo)

```
Editorial photography, medium format camera, natural lens compression, warm 2700K practical
lighting, deep rich blacks, moderate contrast, soft highlight roll-off, subtle film grain,
quiet luxury aesthetic, color palette of near-black, warm off-white and natural materials,
with at most one small accent of fresh lime green (#A0E261). Photorealistic. No text, no
logos, no brand names, no readable labels, no signage, no watermark.
```

---

## 1. Hero — loja no lobby à noite (16:9) · `hero-loja-noite`
Uso: hero da home (imagem que expande para tela cheia). Recorte mobile 4:5 a partir dela.

```
Wide 16:9 architectural photograph at night of a small, elegant autonomous convenience store
integrated into the ground-floor lobby of a high-end residential condominium in Brasília,
Brazil. The store is a recessed niche of about 15 square meters lined with dark smoked-oak
shelving and matte black metal, glass-door refrigerators glowing with warm light, neatly
curated products (wine bottles, artisanal chocolates, olive oils, premium pantry items)
arranged with generous spacing like a boutique. A slim black self-checkout kiosk with a
dark screen stands at the entrance. The lobby around it has polished travertine floor,
modernist concrete and wood paneling, a low designer armchair and a large indoor plant,
floor-to-ceiling glass showing a dark blue night outside. No people. Camera at eye level,
slightly off-center, 35mm lens, store occupying the right two thirds of the frame, calm
empty space on the left for a headline. A single thin line of lime green LED (#A0E261)
glows along the top edge of the niche. Editorial photography, medium format camera, warm
2700K practical lighting, deep rich blacks, moderate contrast, soft highlight roll-off,
subtle film grain, quiet luxury aesthetic. Photorealistic. No text, no logos, no brand
names, no readable labels, no signage, no watermark.
```

## 2. Curadoria · Adega (4:5) · `curadoria-adega`

```
Vertical 4:5 still life of three bottles of fine red and white wine standing on a matte
black stone surface against a pure black background, one bottle slightly forward, a
crystal wine glass catching a sliver of warm light. Low-key studio lighting from a single
large softbox at the upper left, gentle rim light defining the bottle shoulders, deep
shadows, rich burgundy and amber tones in the glass. Labels are minimal and blank, without
any readable text. Editorial product photography, medium format camera, 90mm macro lens,
moderate contrast, soft highlight roll-off, subtle film grain, quiet luxury aesthetic.
Photorealistic. No text, no logos, no brand names, no readable labels, no watermark.
```

## 3. Curadoria · Empório (4:5) · `curadoria-emporio`

```
Vertical 4:5 editorial still life on a black slate board against a pure black background:
a wedge of aged artisanal cheese, a bar of dark chocolate partially unwrapped from plain
kraft paper showing its glossy snap, a small dark glass bottle of extra virgin olive oil
with a drop on the rim, a few whole almonds and a sprig of rosemary. Composition with
generous negative space at the top. Low-key lighting from a single soft source at the
side, warm tones, deep shadows, textures sharply detailed. Editorial food photography,
medium format camera, 100mm macro lens, moderate contrast, soft highlight roll-off,
subtle film grain, quiet luxury aesthetic. Photorealistic. No text, no logos, no brand
names, no readable labels, no watermark.
```

## 4. Curadoria · Despensa 24h (4:5) · `curadoria-despensa`

```
Vertical 4:5 still life of premium everyday essentials arranged with precision on a dark
smoked-oak shelf against a black background: a glass bottle of sparkling mineral water,
a bag of specialty coffee beans in plain matte paper, a jar of honey, a box of artisanal
dry pasta in plain packaging, and a small bunch of fresh green grapes. Clean, orderly,
boutique-like spacing between items. Warm low-key lighting from above like a store shelf
light, deep shadows, rich textures. Editorial product photography, medium format camera,
50mm lens, moderate contrast, soft highlight roll-off, subtle film grain, quiet luxury
aesthetic. Photorealistic. No text, no logos, no brand names, no readable labels,
no watermark.
```

## 5. Curadoria · Bem-estar (4:5) · `curadoria-bem-estar` — [CONFIRMAR categoria]

```
Vertical 4:5 still life against a pure black background: a cold-pressed green juice in a
clear glass bottle with condensation, a few protein snack bars in plain matte wrappers,
a small glass bottle of kombucha, a bowl of mixed nuts and a lime cut in half. Fresh,
clean, healthy mood. Low-key lighting from a single soft source, crisp water droplets,
deep shadows. Editorial product photography, medium format camera, 90mm macro lens,
moderate contrast, soft highlight roll-off, subtle film grain, quiet luxury aesthetic.
Photorealistic. No text, no logos, no brand names, no readable labels, no watermark.
```

## 6. Antes — nicho vazio no hall (16:9) · `projeto-antes`
Uso: slider antes/depois. Gere **primeiro** este; depois gere o item 7 **anexando esta
imagem como referência** e pedindo para manter enquadramento, luz e arquitetura idênticos.

```
Wide 16:9 architectural photograph of an empty recessed niche of about 15 square meters
in the ground-floor lobby of a high-end residential condominium in Brasília, Brazil, in
the evening. Polished travertine floor, walls in light concrete and vertical wood slats,
recessed ceiling lights with warm 2700K glow, a single power outlet visible on the back
wall. The niche is completely empty and clean. Camera at eye level, straight-on, 35mm
lens, symmetrical composition. No people. Editorial architectural photography, medium
format camera, deep rich blacks, moderate contrast, soft highlight roll-off, subtle film
grain, quiet luxury aesthetic. Photorealistic. No text, no logos, no signage, no
watermark.
```

## 7. Depois — loja instalada (16:9) · `projeto-depois`
**Anexe a imagem 6 como referência.**

```
Using the attached image as the exact reference, keep the identical camera position,
framing, lens, lighting, travertine floor, walls and ceiling. Only fill the empty niche
with a small, elegant autonomous convenience store: dark smoked-oak shelving and matte
black metal, two glass-door refrigerators glowing with warm light, curated products
(wine bottles, artisanal chocolates, olive oils, premium pantry items) arranged with
generous spacing like a boutique, and a slim black self-checkout kiosk with a dark screen
at the front. A single thin line of lime green LED (#A0E261) along the top edge of the
niche. No people. Photorealistic, quiet luxury aesthetic. No text, no logos, no brand
names, no readable labels, no signage, no watermark.
```

## 8. Morador · mão pegando um vinho (4:5) · `morador-adega`

```
Vertical 4:5 close-up photograph of a well-groomed hand with a simple watch reaching into
a glass-door wine refrigerator at night and taking out a bottle of red wine. Warm light
from inside the refrigerator, dark smoked-oak frame, the rest of the scene falls into
deep shadow. Only the hand and forearm visible, wearing a knit sweater sleeve in warm
off-white. Shallow depth of field. Editorial lifestyle photography, medium format camera,
85mm lens, warm 2700K light, moderate contrast, soft highlight roll-off, subtle film
grain, quiet luxury aesthetic. Photorealistic. No text, no logos, no brand names, no
readable labels, no watermark.
```

## 9. Totem · Scan & Go (3:4) · `totem-scan`

```
Vertical 3:4 close-up photograph of a hand holding a small bar of dark chocolate in plain
packaging under the barcode scanner of a sleek matte black self-checkout kiosk. A thin
line of lime green scanning light (#A0E261) crosses the package. The kiosk screen is dark
with a soft glow, no readable interface text. Background in deep shadow with warm bokeh
from store shelves. Shallow depth of field. Editorial product photography, medium format
camera, 85mm lens, warm 2700K light, moderate contrast, soft highlight roll-off, subtle
film grain, quiet luxury aesthetic. Photorealistic. No text, no logos, no brand names,
no readable labels, no watermark.
```
