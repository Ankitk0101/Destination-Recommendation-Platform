const express = require('express');
const { 
  searchDestinations, 
  getPaths, 
  getPathDetails, 
  getPopularDestinations 
} = require('../controllers/destinationController');

const router = express.Router();

router.get('/search', searchDestinations);
router.get('/paths', getPaths);
router.get('/paths/:id', getPathDetails);
router.get('/popular', getPopularDestinations);

module.exports = router;