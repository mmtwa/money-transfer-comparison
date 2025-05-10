const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { validationResult, check } = require('express-validator');

// Define Content schema if it doesn't already exist
let Content;
try {
  Content = mongoose.model('Content');
} catch {
  const ContentSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['guide', 'faq', 'page'],
      required: true
    },
    category: {
      type: String,
      trim: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    publishedDate: {
      type: Date,
      default: Date.now
    },
    updatedDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft'
    },
    featured: {
      type: Boolean,
      default: false
    },
    images: {
      heroImage: {
        type: String,
        default: ''
      },
      contentImages: {
        type: [String],
        default: []
      }
    },
    seo: {
      title: String,
      description: String,
      keywords: [String]
    },
    analytics: {
      views: {
        type: Number,
        default: 0
      },
      averageTimeOnPage: {
        type: Number,
        default: 0
      },
      bounceRate: {
        type: Number,
        default: 0
      }
    }
  });

  ContentSchema.pre('save', function(next) {
    this.updatedDate = Date.now();
    next();
  });

  Content = mongoose.model('Content', ContentSchema);
}

/**
 * @route   GET /api/admin/content
 * @desc    Get all content items
 * @access  Admin
 */
router.get('/', async (req, res) => {
  try {
    // Filter by type if provided in query
    const filter = {};
    if (req.query.type) {
      filter.type = req.query.type;
    }
    
    const content = await Content.find(filter)
      .populate('author', 'name email')
      .sort({ updatedDate: -1 });
    
    res.json({
      success: true,
      count: content.length,
      data: content
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({
      success: false,
      message: 'Could not fetch content',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

/**
 * @route   GET /api/admin/content/images
 * @desc    Get available images for content editor
 * @access  Admin
 */
router.get('/images', async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const imagesDir = path.join(__dirname, '../../../client/src/assets/images/guides');
    
    // Ensure directory exists
    if (!fs.existsSync(imagesDir)) {
      return res.status(200).json({
        success: true,
        images: []
      });
    }
    
    // Read directory contents
    const files = fs.readdirSync(imagesDir);
    
    // Filter for image files and format paths
    const imageFiles = files
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map(file => `/images/guides/${file}`);
    
    res.json({
      success: true,
      images: imageFiles
    });
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({
      success: false,
      message: 'Could not fetch images',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

/**
 * @route   GET /api/admin/content/:id
 * @desc    Get single content item by ID
 * @access  Admin
 */
router.get('/:id', async (req, res) => {
  try {
    const content = await Content.findById(req.params.id)
      .populate('author', 'name email');
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }
    
    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({
      success: false,
      message: 'Could not fetch content',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

/**
 * @route   POST /api/admin/content
 * @desc    Create a new content item
 * @access  Admin
 */
router.post('/', [
  check('title', 'Title is required').not().isEmpty(),
  check('content', 'Content is required').not().isEmpty(),
  check('type', 'Type is required').isIn(['guide', 'faq', 'page']),
  check('slug', 'Slug is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    // Check if slug is already in use
    const existingContent = await Content.findOne({ slug: req.body.slug });
    if (existingContent) {
      return res.status(400).json({
        success: false,
        message: 'Slug is already in use'
      });
    }
    
    // Add author info if provided in user object
    if (req.user) {
      req.body.author = req.user.id;
    }
    
    const newContent = new Content(req.body);
    await newContent.save();
    
    res.status(201).json({
      success: true,
      data: newContent
    });
  } catch (error) {
    console.error('Error creating content:', error);
    res.status(500).json({
      success: false,
      message: 'Could not create content',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

/**
 * @route   PUT /api/admin/content/:id
 * @desc    Update a content item
 * @access  Admin
 */
router.put('/:id', async (req, res) => {
  try {
    let content = await Content.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }
    
    // Check if slug changed and is already in use
    if (req.body.slug && req.body.slug !== content.slug) {
      const existingContent = await Content.findOne({ slug: req.body.slug });
      if (existingContent) {
        return res.status(400).json({
          success: false,
          message: 'Slug is already in use'
        });
      }
    }
    
    // Update content with new data
    content = await Content.findByIdAndUpdate(
      req.params.id, 
      { 
        ...req.body,
        updatedDate: Date.now()
      }, 
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({
      success: false,
      message: 'Could not update content',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

/**
 * @route   DELETE /api/admin/content/:id
 * @desc    Delete a content item
 * @access  Admin
 */
router.delete('/:id', async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }
    
    await content.remove();
    
    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting content:', error);
    res.status(500).json({
      success: false,
      message: 'Could not delete content',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

/**
 * @route   POST /api/admin/content/:id/publish
 * @desc    Publish a content item
 * @access  Admin
 */
router.post('/:id/publish', async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }
    
    content.status = 'published';
    content.publishedDate = Date.now();
    await content.save();
    
    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Error publishing content:', error);
    res.status(500).json({
      success: false,
      message: 'Could not publish content',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

module.exports = router; 