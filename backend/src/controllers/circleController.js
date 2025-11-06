const Circle = require('../models/Circle');
const Department = require('../models/Department');

// @desc    Get all circles
// @route   GET /api/circles
// @access  Public
exports.getAllCircles = async (req, res) => {
  try {
    const circles = await Circle.find()
      .sort('order')
      .populate('departments', 'name slug teamLead documentCount');
    
    res.json({
      success: true,
      count: circles.length,
      data: circles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single circle by ID
// @route   GET /api/circles/:id
// @access  Public
exports.getCircleById = async (req, res) => {
  try {
    const circle = await Circle.findById(req.params.id)
      .populate('departments', 'name slug teamLead documentCount description');
    
    if (!circle) {
      return res.status(404).json({
        success: false,
        error: 'Circle not found'
      });
    }
    
    res.json({
      success: true,
      data: circle
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get circle by slug
// @route   GET /api/circles/slug/:slug
// @access  Public
exports.getCircleBySlug = async (req, res) => {
  try {
    const circle = await Circle.findOne({ slug: req.params.slug })
      .populate('departments', 'name slug teamLead documentCount description icon');
    
    if (!circle) {
      return res.status(404).json({
        success: false,
        error: 'Circle not found'
      });
    }
    
    res.json({
      success: true,
      data: circle
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create new circle (Admin)
// @route   POST /api/circles
// @access  Private (to be implemented)
exports.createCircle = async (req, res) => {
  try {
    const circle = await Circle.create(req.body);
    
    res.status(201).json({
      success: true,
      data: circle
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update circle (Admin)
// @route   PUT /api/circles/:id
// @access  Private (to be implemented)
exports.updateCircle = async (req, res) => {
  try {
    const circle = await Circle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!circle) {
      return res.status(404).json({
        success: false,
        error: 'Circle not found'
      });
    }
    
    res.json({
      success: true,
      data: circle
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete circle (Admin)
// @route   DELETE /api/circles/:id
// @access  Private (to be implemented)
exports.deleteCircle = async (req, res) => {
  try {
    const circle = await Circle.findById(req.params.id);
    
    if (!circle) {
      return res.status(404).json({
        success: false,
        error: 'Circle not found'
      });
    }
    
    // Delete all departments in this circle
    await Department.deleteMany({ circleId: circle._id });
    
    await circle.deleteOne();
    
    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
