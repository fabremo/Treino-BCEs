
export interface Situation {
  slug: string;
  title: string;
  icon: string;
}

export interface PhraseSlot {
  name: string;
  examples: string[];
}

export interface Phrase {
  id: string;
  situationSlug: string;
  englishText: string;
  portugueseText: string;
  slots?: PhraseSlot[];
}

export const situations: Situation[] = [
  { slug: 'restaurant', title: 'Restaurante', icon: '🍽️' },
  { slug: 'hotel', title: 'Hotel', icon: '🏨' },
  { slug: 'airport', title: 'Aeroporto', icon: '✈️' },
  { slug: 'directions', title: 'Direções', icon: '🧭' },
  { slug: 'shopping', title: 'Compras', icon: '🛍️' },
  { slug: 'emergency', title: 'Emergência', icon: '🚑' },
];

export const phrases: Phrase[] = [
  // --- Restaurante / Café ---
  { 
    id: 'rest_1', 
    situationSlug: 'restaurant', 
    englishText: 'Can I have {item}, please?', 
    portugueseText: 'Posso pedir {item}, por favor?',
    slots: [{ name: 'item', examples: ['a coffee', 'the chicken', 'a glass of water'] }]
  },
  { 
    id: 'rest_2', 
    situationSlug: 'restaurant', 
    englishText: 'I’d like {item}, please.', 
    portugueseText: 'Eu gostaria de {item}, por favor.',
    slots: [{ name: 'item', examples: ['the salad', 'the steak', 'dessert'] }]
  },
  { 
    id: 'rest_3', 
    situationSlug: 'restaurant', 
    englishText: 'Do you have {item}?', 
    portugueseText: 'Vocês têm {item}?',
    slots: [{ name: 'item', examples: ['vegetarian food', 'a menu', 'high chairs'] }]
  },
  { 
    id: 'rest_4', 
    situationSlug: 'restaurant', 
    englishText: 'No {ingredient}, please.', 
    portugueseText: 'Sem {ingredient}, por favor.',
    slots: [{ name: 'ingredient', examples: ['onions', 'sugar', 'ice'] }]
  },
  { 
    id: 'rest_5', 
    situationSlug: 'restaurant', 
    englishText: 'Could we get the {thing}, please?', 
    portugueseText: 'Pode trazer o(a) {thing}, por favor?',
    slots: [{ name: 'thing', examples: ['menu', 'bill', 'check'] }]
  },

  // --- Hotel ---
  { 
    id: 'hotel_1', 
    situationSlug: 'hotel', 
    englishText: 'I have a reservation under {name}.', 
    portugueseText: 'Tenho uma reserva no nome de {name}.',
    slots: [{ name: 'name', examples: ['Smith', 'Silva'] }]
  },
  { 
    id: 'hotel_2', 
    situationSlug: 'hotel', 
    englishText: 'I’d like to {action}.', 
    portugueseText: 'Eu gostaria de {action}.',
    slots: [{ name: 'action', examples: ['check in', 'check out'] }]
  },
  { 
    id: 'hotel_3', 
    situationSlug: 'hotel', 
    englishText: 'What time is {thing}?', 
    portugueseText: 'Que horas é {thing}?',
    slots: [{ name: 'thing', examples: ['breakfast', 'check-out'] }]
  },
  { 
    id: 'hotel_4', 
    situationSlug: 'hotel', 
    englishText: 'I need {item}.', 
    portugueseText: 'Eu preciso de {item}.',
    slots: [{ name: 'item', examples: ['towels', 'help', 'a room key'] }]
  },
  { 
    id: 'hotel_5', 
    situationSlug: 'hotel', 
    englishText: 'Is {thing} included?', 
    portugueseText: '{thing} está incluído?',
    slots: [{ name: 'thing', examples: ['breakfast', 'Wi-Fi'] }]
  },

  // --- Aeroporto ---
  { 
    id: 'air_1', 
    situationSlug: 'airport', 
    englishText: 'Where is gate {number}?', 
    portugueseText: 'Onde fica o portão {number}?',
    slots: [{ name: 'number', examples: ['10', 'A2', 'B5'] }]
  },
  { 
    id: 'air_2', 
    situationSlug: 'airport', 
    englishText: 'Where is {place}?', 
    portugueseText: 'Onde fica {place}?',
    slots: [{ name: 'place', examples: ['baggage claim', 'security'] }]
  },
  { 
    id: 'air_3', 
    situationSlug: 'airport', 
    englishText: 'My flight is {status}.', 
    portugueseText: 'Meu voo está {status}.',
    slots: [{ name: 'status', examples: ['delayed', 'cancelled'] }]
  },
  { 
    id: 'air_4', 
    situationSlug: 'airport', 
    englishText: 'I need to {action}.', 
    portugueseText: 'Eu preciso {action}.',
    slots: [{ name: 'action', examples: ['change my ticket', 'check in'] }]
  },
  { 
    id: 'air_5', 
    situationSlug: 'airport', 
    englishText: 'I missed my {thing}.', 
    portugueseText: 'Eu perdi {thing}.',
    slots: [{ name: 'thing', examples: ['flight', 'connection'] }]
  },

  // --- Direções ---
  { 
    id: 'dir_1', 
    situationSlug: 'directions', 
    englishText: 'How do I get to {place}?', 
    portugueseText: 'Como chego a {place}?',
    slots: [{ name: 'place', examples: ['the hotel', 'the station', 'Central Park'] }]
  },
  { 
    id: 'dir_2', 
    situationSlug: 'directions', 
    englishText: 'Is it far from here?', 
    portugueseText: 'É longe daqui?',
    slots: []
  },
  { 
    id: 'dir_3', 
    situationSlug: 'directions', 
    englishText: 'Which {transport} goes to {place}?', 
    portugueseText: 'Qual {transport} vai para {place}?',
    slots: [
      { name: 'transport', examples: ['bus', 'train'] },
      { name: 'place', examples: ['the center', 'the airport'] }
    ]
  },
  { 
    id: 'dir_4', 
    situationSlug: 'directions', 
    englishText: 'Can you show me on the {thing}?', 
    portugueseText: 'Você pode me mostrar no {thing}?',
    slots: [{ name: 'thing', examples: ['map', 'phone'] }]
  },
  { 
    id: 'dir_5', 
    situationSlug: 'directions', 
    englishText: 'I’m looking for {place}.', 
    portugueseText: 'Estou procurando {place}.',
    slots: [{ name: 'place', examples: ['a bank', 'the subway'] }]
  },

  // --- Compras ---
  { 
    id: 'shop_1', 
    situationSlug: 'shopping', 
    englishText: 'How much is {item}?', 
    portugueseText: 'Quanto custa {item}?',
    slots: [{ name: 'item', examples: ['this', 'the shirt', 'the souvenir'] }]
  },
  { 
    id: 'shop_2', 
    situationSlug: 'shopping', 
    englishText: 'Do you have this in {option}?', 
    portugueseText: 'Você tem isso em {option}?',
    slots: [{ name: 'option', examples: ['another size', 'black', 'red'] }]
  },
  { 
    id: 'shop_3', 
    situationSlug: 'shopping', 
    englishText: 'Can I try this on?', 
    portugueseText: 'Posso experimentar isso?',
    slots: []
  },
  { 
    id: 'shop_4', 
    situationSlug: 'shopping', 
    englishText: 'I’m just looking, thanks.', 
    portugueseText: 'Estou só olhando, obrigado(a).',
    slots: []
  },
  { 
    id: 'shop_5', 
    situationSlug: 'shopping', 
    englishText: 'Can I pay by {method}?', 
    portugueseText: 'Posso pagar com {method}?',
    slots: [{ name: 'method', examples: ['card', 'cash'] }]
  },

  // --- Emergência ---
  { 
    id: 'em_1', 
    situationSlug: 'emergency', 
    englishText: 'I don’t feel {state}.', 
    portugueseText: 'Não estou me sentindo {state}.',
    slots: [{ name: 'state', examples: ['well', 'good'] }]
  },
  { 
    id: 'em_2', 
    situationSlug: 'emergency', 
    englishText: 'I need a {person}.', 
    portugueseText: 'Eu preciso de um(a) {person}.',
    slots: [{ name: 'person', examples: ['doctor', 'nurse', 'police officer'] }]
  },
  { 
    id: 'em_3', 
    situationSlug: 'emergency', 
    englishText: 'It hurts {place}.', 
    portugueseText: 'Dói {place}.',
    slots: [{ name: 'place', examples: ['here', 'my head', 'my stomach'] }]
  },
  { 
    id: 'em_4', 
    situationSlug: 'emergency', 
    englishText: 'I’m allergic to {thing}.', 
    portugueseText: 'Sou alérgico(a) a {thing}.',
    slots: [{ name: 'thing', examples: ['peanuts', 'penicillin', 'seafood'] }]
  },
  { 
    id: 'em_5', 
    situationSlug: 'emergency', 
    englishText: 'I lost my {item}.', 
    portugueseText: 'Eu perdi {item}.',
    slots: [{ name: 'item', examples: ['passport', 'wallet', 'phone'] }]
  },
];
