const { createSlug } = require('../../src/utils/slug');

describe('createSlug', () => {
  test('converts text to a url-friendly slug', () => {
    expect(createSlug('New Product Launch')).toBe('new-product-launch');
  });

  test('trims and normalizes special characters', () => {
    expect(createSlug('  Fincra & Partners: 2024 Review  ')).toBe('fincra-and-partners-2024-review');
  });

  test('falls back to "item" slug when input produces empty slug', () => {
    expect(createSlug('@@@')).toBe('item');
  });

  test('throws when input is not a string', () => {
    expect(() => createSlug(null)).toThrow('createSlug expects a non-empty string');
  });
});

