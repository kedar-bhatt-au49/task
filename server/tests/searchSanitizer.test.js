const { sanitizeSearch } = require('../src/utils/searchSanitizer');

describe('sanitizeSearch', () => {
  it('should escape regex special characters', () => {
    const result = sanitizeSearch('hello.*world');
    expect(result).toBe('hello\\.\\*world');
  });

  it('should handle empty input', () => {
    expect(sanitizeSearch('')).toBe('');
    expect(sanitizeSearch(null)).toBe('');
    expect(sanitizeSearch(undefined)).toBe('');
  });

  it('should handle normal text', () => {
    expect(sanitizeSearch('hello world')).toBe('hello world');
  });

  it('should truncate long input', () => {
    const long = 'a'.repeat(300);
    expect(sanitizeSearch(long).length).toBe(200);
  });

  it('should escape all regex metacharacters', () => {
    const input = '.*+?^${}()|[]\\';
    const result = sanitizeSearch(input);
    expect(result).not.toContain(input);
    expect(result).toContain('\\.');
    expect(result).toContain('\\*');
    expect(result).toContain('\\+');
  });
});
