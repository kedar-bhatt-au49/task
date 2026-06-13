const MAX_SEARCH_LENGTH = 200;

function sanitizeSearch(input) {
  if (!input) return '';
  const str = String(input);
  return str
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .slice(0, MAX_SEARCH_LENGTH);
}

module.exports = { sanitizeSearch };
