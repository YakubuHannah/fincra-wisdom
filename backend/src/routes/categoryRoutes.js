const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// Get all active categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ status: 'active' })
      .sort({ name: 1 });

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
});

// Create new category (admin only)
router.post('/', async (req, res) => {
  try {
    const { name, description, icon } = req.body;

    console.log('📝 Creating category:', { name, description, icon });

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') }
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category already exists'
      });
    }

    // Generate slug manually
    const slug = name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();

    const categoryData = {
      name,
      slug,  // Add the slug!
      description: description || '',
      icon: icon || '📦'
    };

    console.log('💾 Saving category data:', categoryData);

    const category = new Category(categoryData);
    await category.save();

    console.log('✅ Category created successfully:', category);

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    console.error('❌ Error creating category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create category',
      error: error.message
    });
  }
});

module.exports = router;