const badWords = [
  'shit', 'fuck', 'bastard', 'damn', 'asshole', 'crap', 'dick', 'piss', 'hell'
];

export function containsBadWords(text) {
  if (!text || typeof text !== 'string') return false;
  const lowered = text.toLowerCase();
  return badWords.some(word => lowered.includes(word));
}

