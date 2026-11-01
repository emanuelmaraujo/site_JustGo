// Marcas de referência da curadoria Just Go Market.
//
// Definidas pela Just Go Market como o padrão de qualidade do mix (31/10/2026).
// Exibidas apenas como NOMES, em tipografia própria — nunca com logotipos de terceiros
// (uso de logotipo exige autorização de cada fabricante).
// O mix de cada loja é montado com o condomínio e depende da disponibilidade dos
// distribuidores: a interface sempre traz essa ressalva junto da lista.

export interface BrandGroup {
  id: string;
  title: string;
  /** Uma linha sobre o que a categoria resolve no dia a dia. */
  note: string;
  brands: string[];
}

export const BRAND_GROUPS: BrandGroup[] = [
  {
    id: 'adega',
    title: 'Adega',
    note: 'Vinhos e espumantes para o jantar e para a visita inesperada.',
    brands: ['Chandon', 'Veuve Clicquot', 'Moët & Chandon', 'Casa Valduga', 'Miolo', 'Catena Zapata', 'Luigi Bosca'],
  },
  {
    id: 'cervejas-destilados',
    title: 'Cervejas e destilados',
    note: 'Especiais e clássicos, sempre gelados.',
    brands: ['Heineken', 'Stella Artois', 'Baden Baden', 'Leffe', 'Johnnie Walker', 'Tanqueray', 'Aperol'],
  },
  {
    id: 'cafes',
    title: 'Cafés',
    note: 'Grãos e moídos de torrefações reconhecidas.',
    brands: ['illy', 'Lavazza', 'Orfeu', 'Baggio'],
  },
  {
    id: 'chocolates',
    title: 'Chocolates e doces',
    note: 'O pequeno luxo de qualquer hora.',
    brands: ['Lindt', 'Ferrero Rocher', 'Toblerone', 'Bonne Maman'],
  },
  {
    id: 'emporio',
    title: 'Empório',
    note: 'Queijos, azeites e massas para cozinhar bem.',
    brands: ['Président', 'Gallo', 'Andorinha', 'Barilla', 'De Cecco'],
  },
  {
    id: 'bebidas',
    title: 'Águas e bebidas',
    note: 'Águas, sucos e energéticos para o dia inteiro.',
    brands: ['San Pellegrino', 'Perrier', 'Acqua Panna', 'do bem', 'Red Bull', 'Coca-Cola'],
  },
  {
    id: 'sorvetes',
    title: 'Sorvetes',
    note: 'Sobremesa pronta, a um elevador de distância.',
    brands: ['Häagen-Dazs', "Ben & Jerry's", 'Magnum'],
  },
  {
    id: 'casa',
    title: 'Casa e cuidado',
    note: 'Higiene e limpeza que não podem faltar.',
    brands: ['Granado', 'Dove', 'Colgate', 'Ypê'],
  },
];

/** Lista plana para a faixa de marcas (marquee). */
export const ALL_BRANDS = BRAND_GROUPS.flatMap((g) => g.brands);

export const BRANDS_DISCLAIMER =
  'Marcas de referência da curadoria. O mix de cada loja é definido com o condomínio e depende da disponibilidade dos distribuidores. Marcas citadas pertencem aos seus respectivos titulares.';
