import axios from 'axios';

export interface MotivationalQuote {
  text: string;
  author: string;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
}

const QUOTES: MotivationalQuote[] = [
  { text: 'A jornada de mil milhas começa com um único passo.', author: 'Lao Tsé' },
  { text: 'O sucesso é a soma de pequenos esforços repetidos dia após dia.', author: 'Robert Collier' },
  { text: 'Não espere. O tempo nunca será perfeito.', author: 'Napoleon Hill' },
  { text: 'Acredite que você pode e você já está na metade do caminho.', author: 'Theodore Roosevelt' },
  { text: 'O único jeito de fazer um grande trabalho é amando o que você faz.', author: 'Steve Jobs' },
];

const CATEGORY_ICONS: Record<string, string> = {
  work: '💼',
  study: '📚',
  health: '🏃',
  personal: '🏠',
  finance: '💰',
  social: '👥',
  entertainment: '🎮',
  travel: '✈️',
  food: '🍕',
  sports: '⚽',
};

export async function fetchMotivationalQuote(): Promise<MotivationalQuote> {
  const index = new Date().getDay() % QUOTES.length;
  return QUOTES[index];
}

export async function fetchCategories(): Promise<Category[]> {
  const response = await axios.get<Array<{ id: number; name: string }>>('https://dummyjson.com/products/categories');
  const raw: Array<{ slug: string; name: string; url: string }> = response.data as unknown as Array<{ slug: string; name: string; url: string }>;
  const mapped: Category[] = raw.slice(0, 10).map((c, i) => ({
    id: i + 1,
    name: c.name,
    icon: CATEGORY_ICONS[c.slug] ?? '📋',
  }));
  return mapped;
}
