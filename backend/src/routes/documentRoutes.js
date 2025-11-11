const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const Document = require('../models/Document');
const SuggestedDocument = require('../models/SuggestedDocument');
const Notification = require('../models/Notification');
const { cloudinary } = require('../config/cloudinary');
const { sendMail } = require('../utils/mail');
const ADMIN_EMAILS = require('../config/adminEmails');
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

// Suggest a document (for regular users) - file will be uploaded but stored as suggestion
router.post('/suggest', isAuthenticated, upload.single('file'), async (req, res) => {
  try {
    // Debugging: log whether token cookie or auth header is present when request hits this endpoint
    try {
      console.log('[/documents/suggest] cookie token present:', !!req.cookies?.token, 'auth header present:', !!req.headers.authorization);
    } catch (e) {
      console.error('Error logging auth presence:', e);
    }
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const { title, description, circleId, departmentId, category, tags } = req.body;
    if (!title || !circleId || !departmentId) {
      return res.status(400).json({ success: false, message: 'Missing required fields: title, circleId, departmentId' });
    }

    const department = await Department.findById(departmentId);
    const circle = await Circle.findById(circleId);
    if (!department || !circle) return res.status(404).json({ success: false, message: 'Department or Circle not found' });

    const fileExt = req.file.originalname.split('.').pop().toLowerCase();
    const slug = generateSlug(title);

    const suggestion = new SuggestedDocument({
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
      submitterId: req.user?.userId,
      submitterEmail: req.user?.email,
      summary: description || '',
      category: category || 'Other'
    });

    await suggestion.save();

    // Create in-app notification for admins
    try {
      for (const adminEmail of ADMIN_EMAILS) {
        await Notification.create({
          recipientEmail: adminEmail,
          title: 'New document suggestion',
          message: `${suggestion.submitterEmail || 'A user'} suggested ${suggestion.title} for ${suggestion.departmentName}`,
          link: `/admin/suggestions`
        });
      }
    } catch (err) {
      console.error('Failed to create admin notifications:', err);
    }

    // Send emails to admins
    try {
      const subject = `New document suggestion: ${suggestion.title}`;
      const html = `<p>${suggestion.submitterEmail || 'A user'} suggested <strong>${suggestion.title}</strong> for <strong>${suggestion.departmentName}</strong>.</p><p><a href="${process.env.FRONTEND_URL}/admin/suggestions">Review suggestion</a></p>`;
      await sendMail({ to: ADMIN_EMAILS.join(','), subject, html, text: `${suggestion.submitterEmail || 'A user'} suggested ${suggestion.title} for ${suggestion.departmentName}.` });
    } catch (err) {
      console.error('Failed to send admin emails:', err);
    }

    res.status(201).json({ success: true, message: 'Document suggested for review', data: suggestion });
  } catch (error) {
    console.error('Suggest upload error:', error);
    res.status(500).json({ success: false, message: 'Failed to suggest document', error: error.message });
  }
});

// Admin: list suggestions
router.get('/suggestions', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const suggestions = await SuggestedDocument.find().sort({ createdAt: -1 });
    res.json({ success: true, count: suggestions.length, data: suggestions });
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch suggestions', error: error.message });
  }
});

// Admin: approve suggestion -> create Document and remove suggestion
router.put('/suggestions/:id/approve', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const suggestion = await SuggestedDocument.findById(req.params.id);
    if (!suggestion) return res.status(404).json({ success: false, message: 'Suggestion not found' });

  // Create Document from suggestion
    const document = new Document({
      title: suggestion.title,
      slug: suggestion.slug,
      departmentId: suggestion.departmentId,
      departmentName: suggestion.departmentName,
      circleId: suggestion.circleId,
      circleName: suggestion.circleName,
      fileUrl: suggestion.fileUrl,
      fileName: suggestion.fileName,
      fileType: suggestion.fileType,
      fileSize: suggestion.fileSize,
      cloudinaryPublicId: suggestion.cloudinaryPublicId,
      category: suggestion.category,
      summary: suggestion.summary,
      content: suggestion.summary,
      author: suggestion.submitterEmail || 'Unknown'
    });

    await document.save();

    // Update department doc count
    await Department.findByIdAndUpdate(suggestion.departmentId, { $inc: { documentCount: 1 } });

    // Remove suggestion
    await suggestion.remove();

    // Notify submitter via in-app notification and email
    try {
      if (document.author) {
        await Notification.create({
          recipientEmail: document.author,
          title: 'Your document suggestion was approved',
          message: `${document.title} has been approved and published to ${document.departmentName}`,
          link: `/departments/${document.departmentId}`
        });
      }

      if (suggestion.submitterEmail) {
        const subject = `Your document suggestion was approved: ${document.title}`;
        const html = `<p>Your suggestion <strong>${document.title}</strong> has been approved and published to <strong>${document.departmentName}</strong>.</p><p><a href="${process.env.FRONTEND_URL}/departments/${document.departmentId}">View document</a></p>`;
        await sendMail({ to: suggestion.submitterEmail, subject, html, text: `Your suggestion ${document.title} has been approved.` });
      }
    } catch (err) {
      console.error('Failed to notify submitter on approval:', err);
    }

    res.json({ success: true, message: 'Suggestion approved and published', data: document });
  } catch (error) {
    console.error('Error approving suggestion:', error);
    res.status(500).json({ success: false, message: 'Failed to approve suggestion', error: error.message });
  }
});

// Admin: reject suggestion
router.put('/suggestions/:id/reject', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const suggestion = await SuggestedDocument.findById(req.params.id);
    if (!suggestion) return res.status(404).json({ success: false, message: 'Suggestion not found' });

    suggestion.status = 'rejected';
    suggestion.adminNotes = req.body.adminNotes || '';
    await suggestion.save();

    // Delete file from Cloudinary if public id exists
    try {
      if (suggestion.cloudinaryPublicId) {
        await cloudinary.uploader.destroy(suggestion.cloudinaryPublicId, { resource_type: 'raw' });
      }
    } catch (err) {
      console.error('Failed to delete file from Cloudinary:', err);
    }

    // Notify submitter via in-app notification and email
    try {
      if (suggestion.submitterEmail) {
        await Notification.create({
          recipientEmail: suggestion.submitterEmail,
          title: 'Your document suggestion was rejected',
          message: `${suggestion.title} was rejected. ${req.body.adminNotes || ''}`,
          link: ''
        });

        const subject = `Your document suggestion was rejected: ${suggestion.title}`;
        const html = `<p>Your suggestion <strong>${suggestion.title}</strong> has been rejected.</p><p>Notes from admin: ${req.body.adminNotes || 'No notes provided.'}</p>`;
        await sendMail({ to: suggestion.submitterEmail, subject, html, text: `Your suggestion ${suggestion.title} has been rejected.` });
      }
    } catch (err) {
      console.error('Failed to notify submitter on rejection:', err);
    }

    res.json({ success: true, message: 'Suggestion rejected', data: suggestion });
  } catch (error) {
    console.error('Error rejecting suggestion:', error);
    res.status(500).json({ success: false, message: 'Failed to reject suggestion', error: error.message });
  }
});