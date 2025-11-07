const mongoose = require('mongoose');
const Category = require('../models/Category');
require('dotenv').config();

// Helper function to generate slug
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
};

const defaultCategories = [
  { name: 'SOP', slug: 'sop', description: 'Standard Operating Procedures', icon: '📋' },
  { name: 'Report', slug: 'report', description: 'Business and analytical reports', icon: '📊' },
  { name: 'Template', slug: 'template', description: 'Document templates', icon: '📄' },
  { name: 'Guide', slug: 'guide', description: 'How-to guides and tutorials', icon: '📖' },
  { name: 'Policy', slug: 'policy', description: 'Company policies and regulations', icon: '⚖️' },
  { name: 'Manual', slug: 'manual', description: 'User and training manuals', icon: '📗' },
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Clear existing categories
    await Category.deleteMany({});
    console.log('✓ Cleared existing categories');

    // Insert default categories
    await Category.insertMany(defaultCategories);
    console.log('✓ Seeded default categories');

    console.log('\n✅ Category seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    process.exit(1);
  }
};

seedCategories();