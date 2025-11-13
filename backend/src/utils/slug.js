const slugify = require('slugify');

const createSlug = (text) => {
  if (!text || typeof text !== 'string') {
    throw new Error('createSlug expects a non-empty string');
  }

  const baseSlug = slugify(text, {
    lower: true,
    strict: true,
    trim: true
  });

  // slugify can return an empty string if the input only contains invalid characters.
  return baseSlug || 'item';
};

module.exports = { createSlug };

