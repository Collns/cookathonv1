export function formatText(text) {
  if (!text || typeof text !== 'string') return '';

  return text
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/(^\w|\.\s*\w)/g, c => c.toUpperCase()); // capitalizes first word and after periods
}
