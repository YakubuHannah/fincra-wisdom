const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const Document = require('../models/Document');
const Department = require('../models/Department');
const Circle = require('../models/Circle');

// Helper function to generate slug
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
};

// Upload document
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { title, description, circleId, departmentId, category, tags, author } = req.body;

    // Validate required fields
    if (!title || !circleId || !departmentId || !category) {
      return res.status(400).json({ 
        message: 'Missing required fields: title, circleId, departmentId, category' 
      });
    }

    // Fetch department and circle names
    const department = await Department.findById(departmentId);
    const circle = await Circle.findById(circleId);

    if (!department || !circle) {
      return res.status(404).json({ message: 'Department or Circle not found' });
    }

    // Get file extension
    const fileExt = req.file.originalname.split('.').pop().toLowerCase();

    // Generate slug from title
    const slug = generateSlug(title);

    // Create searchable text for better search
    const searchableText = `${title} ${description || ''} ${tags || ''}`.toLowerCase();

    // Create document record
    const document = new Document({
      title,
      slug,
      departmentId,
      departmentName: department.name,
      circleId,
      circleName: circle.name,
      fileUrl: req.file.path,
      fileName: req.file.originalname,
      fileType: fileExt,
      fileSize: req.file.size,
      cloudinaryPublicId: req.file.filename,
      category,
      summary: description || '',
      content: description || '',
      tags: tags ? (Array.isArray(tags) ? tags : JSON.parse(tags)) : [],
      author: author || 'Unknown',
      searchableText
    });

    await document.save();

    // Update department document count
    await Department.findByIdAndUpdate(
      departmentId,
      { $inc: { documentCount: 1 } }
    );

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      data: document
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to upload document',
      error: error.message 
    });
  }
});

// Get documents by department
router.get('/department/:departmentId', async (req, res) => {
  try {
    const { departmentId } = req.params;
    
    const documents = await Document.find({ departmentId })
      .populate('circleId', 'name color')
      .populate('departmentId', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: documents
    });

  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch documents',
      error: error.message 
    });
  }
});

// Get single document by ID
router.get('/:id', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('circleId', 'name color')
      .populate('departmentId', 'name');

    if (!document) {
      return res.status(404).json({ 
        success: false,
        message: 'Document not found' 
      });
    }

    // Increment view count
    await document.incrementViewCount();

    res.json({
      success: true,
      data: document
    });

  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch document',
      error: error.message 
    });
  }
});

// Get all documents (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { circleId, departmentId, category, search } = req.query;
    
    let query = {};
    
    if (circleId) query.circleId = circleId;
    if (departmentId) query.departmentId = departmentId;
    if (category) query.category = category;
    if (search) {
      query.$text = { $search: search };
    }

    const documents = await Document.find(query)
      .populate('circleId', 'name color')
      .populate('departmentId', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: documents.length,
      data: documents
    });

  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch documents',
      error: error.message 
    });
  }
});

// Increment download count
router.post('/:id/download', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ 
        success: false,
        message: 'Document not found' 
      });
    }

    await document.incrementDownloadCount();

    res.json({
      success: true,
      message: 'Download count incremented'
    });

  } catch (error) {
    console.error('Error incrementing download count:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to increment download count',
      error: error.message 
    });
  }
});

module.exports = router;