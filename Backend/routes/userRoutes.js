const express = require('express');
const { authenticate } = require('../middleware/auth');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Get user profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferences: user.preferences,
        searchHistory: user.searchHistory,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update user profile
router.put('/profile', 
  authenticate,
  [
    body('name')
      .optional()
      .isLength({ min: 2 })
      .withMessage('Name must be at least 2 characters long')
      .trim(),
    body('travelStyle')
      .optional()
      .isIn(['budget', 'comfort', 'luxury'])
      .withMessage('Travel style must be budget, comfort, or luxury'),
    body('preferredTransport')
      .optional()
      .isArray()
      .withMessage('Preferred transport must be an array')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { name, travelStyle, preferredTransport } = req.body;
      const updateData = {};

      if (name) updateData.name = name;
      if (travelStyle) updateData['preferences.travelStyle'] = travelStyle;
      if (preferredTransport) updateData['preferences.preferredTransport'] = preferredTransport;

      const user = await User.findByIdAndUpdate(
        req.userId,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          preferences: user.preferences,
          updatedAt: user.updatedAt
        }
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while updating profile',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

// Get user search history
router.get('/search-history', authenticate, async (req, res) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const user = await User.findById(req.userId)
      .select('searchHistory')
      .slice('searchHistory', [skip, parseInt(limit)]);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Sort search history by date (newest first)
    const sortedHistory = user.searchHistory.sort((a, b) => 
      new Date(b.searchedAt) - new Date(a.searchedAt)
    );

    res.json({
      success: true,
      searchHistory: sortedHistory,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: user.searchHistory.length
      }
    });
  } catch (error) {
    console.error('Get search history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching search history',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Add search to user history
router.post('/search-history', 
  authenticate,
  [
    body('from')
      .notEmpty()
      .withMessage('From location is required')
      .trim(),
    body('to')
      .notEmpty()
      .withMessage('To location is required')
      .trim()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { from, to } = req.body;

      // Check if this search already exists in recent history (within last hour)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      
      const user = await User.findById(req.userId);
      const recentDuplicate = user.searchHistory.find(search => 
        search.from.toLowerCase() === from.toLowerCase() &&
        search.to.toLowerCase() === to.toLowerCase() &&
        new Date(search.searchedAt) > oneHourAgo
      );

      if (recentDuplicate) {
        // Update the timestamp of existing search
        await User.updateOne(
          { 
            _id: req.userId, 
            'searchHistory._id': recentDuplicate._id 
          },
          { 
            $set: { 
              'searchHistory.$.searchedAt': new Date() 
            } 
          }
        );
      } else {
        // Add new search to history (limit to 50 most recent)
        await User.findByIdAndUpdate(
          req.userId,
          {
            $push: {
              searchHistory: {
                $each: [{
                  from,
                  to,
                  searchedAt: new Date()
                }],
                $slice: -50 // Keep only last 50 searches
              }
            }
          }
        );
      }

      res.json({
        success: true,
        message: 'Search added to history'
      });
    } catch (error) {
      console.error('Add search history error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while adding search to history',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

// Clear search history
router.delete('/search-history', authenticate, async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.userId,
      { $set: { searchHistory: [] } }
    );

    res.json({
      success: true,
      message: 'Search history cleared successfully'
    });
  } catch (error) {
    console.error('Clear search history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while clearing search history',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Delete specific search from history
router.delete('/search-history/:searchId', authenticate, async (req, res) => {
  try {
    const { searchId } = req.params;

    const result = await User.findByIdAndUpdate(
      req.userId,
      {
        $pull: {
          searchHistory: { _id: searchId }
        }
      }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Search removed from history'
    });
  } catch (error) {
    console.error('Delete search error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting search from history',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get user statistics
router.get('/statistics', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('searchHistory createdAt');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Calculate statistics
    const totalSearches = user.searchHistory.length;
    
    // Most frequent routes
    const routeCounts = user.searchHistory.reduce((acc, search) => {
      const route = `${search.from} → ${search.to}`;
      acc[route] = (acc[route] || 0) + 1;
      return acc;
    }, {});

    const favoriteRoutes = Object.entries(routeCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([route, count]) => ({ route, count }));

    // Recent activity
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentSearches = user.searchHistory.filter(
      search => new Date(search.searchedAt) > thirtyDaysAgo
    ).length;

    const statistics = {
      totalSearches,
      recentSearches,
      favoriteRoutes,
      memberSince: user.createdAt,
      accountAgeDays: Math.floor((new Date() - user.createdAt) / (1000 * 60 * 60 * 24))
    };

    res.json({
      success: true,
      statistics
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update user preferences only
router.patch('/preferences', 
  authenticate,
  [
    body('travelStyle')
      .optional()
      .isIn(['budget', 'comfort', 'luxury'])
      .withMessage('Travel style must be budget, comfort, or luxury'),
    body('preferredTransport')
      .optional()
      .isArray()
      .withMessage('Preferred transport must be an array'),
    body('preferredTransport.*')
      .isIn(['train', 'bus', 'flight', 'car'])
      .withMessage('Invalid transport type')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { travelStyle, preferredTransport } = req.body;
      const updateData = {};

      if (travelStyle) updateData['preferences.travelStyle'] = travelStyle;
      if (preferredTransport) updateData['preferences.preferredTransport'] = preferredTransport;

      const user = await User.findByIdAndUpdate(
        req.userId,
        { $set: updateData },
        { new: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        message: 'Preferences updated successfully',
        preferences: user.preferences
      });
    } catch (error) {
      console.error('Update preferences error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while updating preferences',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

// Delete user account
router.delete('/account', authenticate, async (req, res) => {
  try {
    const { confirm } = req.body;

    if (!confirm) {
      return res.status(400).json({
        success: false,
        message: 'Please confirm account deletion'
      });
    }

    const user = await User.findByIdAndDelete(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting account',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;