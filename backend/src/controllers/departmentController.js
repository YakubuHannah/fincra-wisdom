const Department = require('../models/Department');
const Document = require('../models/Document');

// @desc    Get all departments
// @route   GET /api/departments
// @access  Public
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find()
      .populate('circleId', 'name slug icon color');
    
    res.json({
      success: true,
      count: departments.length,
      data: departments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get department by ID
// @route   GET /api/departments/:id
// @access  Public
exports.getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id)
      .populate('circleId', 'name slug icon color');
    
    if (!department) {
      return res.status(404).json({
        success: false,
        error: 'Department not found'
      });
    }
    
    res.json({
      success: true,
      data: department
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get departments by circle
// @route   GET /api/departments/circle/:circleId
// @access  Public
exports.getDepartmentsByCircle = async (req, res) => {
  try {
    const departments = await Department.find({ circleId: req.params.circleId })
      .sort('name');
    
    res.json({
      success: true,
      count: departments.length,
      data: departments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get department by slug
// @route   GET /api/departments/slug/:slug
// @access  Public
exports.getDepartmentBySlug = async (req, res) => {
  try {
    const department = await Department.findOne({ slug: req.params.slug })
      .populate('circleId', 'name slug icon color');
    
    if (!department) {
      return res.status(404).json({
        success: false,
        error: 'Department not found'
      });
    }
    
    res.json({
      success: true,
      data: department
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create department
// @route   POST /api/departments
// @access  Private
exports.createDepartment = async (req, res) => {
  try {
    const department = await Department.create(req.body);
    
    res.status(201).json({
      success: true,
      data: department
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update department
// @route   PUT /api/departments/:id
// @access  Private
exports.updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!department) {
      return res.status(404).json({
        success: false,
        error: 'Department not found'
      });
    }
    
    res.json({
      success: true,
      data: department
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete department
// @route   DELETE /api/departments/:id
// @access  Private
exports.deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    
    if (!department) {
      return res.status(404).json({
        success: false,
        error: 'Department not found'
      });
    }
    
    // Delete all documents in this department
    await Document.deleteMany({ departmentId: department._id });
    
    await department.deleteOne();
    
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
