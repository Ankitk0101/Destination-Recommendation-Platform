const Destination = require('../models/Destination');
const Path = require('../models/Path');


exports.searchDestinations = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.length < 2) {
      return res.json([]);
    }

    const destinations = await Destination.find({
      $text: { $search: query }
    })
    .limit(10)
    .select('name country type')
    .sort({ popularity: -1 });

    res.json(destinations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get paths between two destinations
exports.getPaths = async (req, res) => {
  try {
    const { from, to, transportType } = req.query;

    if (!from || !to) {
      return res.status(400).json({ message: 'From and to parameters are required' });
    }

    let query = { 
      from: new RegExp(from, 'i'), 
      to: new RegExp(to, 'i') 
    };

    if (transportType) {
      query['transportOptions.type'] = transportType;
    }

    const paths = await Path.find(query)
      .sort({ popularity: -1 })
      .limit(10);

    // Increment popularity for searched paths
    if (paths.length > 0) {
      await Path.updateMany(
        { _id: { $in: paths.map(p => p._id) } },
        { $inc: { popularity: 1 } }
      );
    }

    res.json(paths);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get path details by ID
exports.getPathDetails = async (req, res) => {
  try {
    const path = await Path.findById(req.params.id);
    
    if (!path) {
      return res.status(404).json({ message: 'Path not found' });
    }

    // Increment popularity
    path.popularity += 1;
    await path.save();

    res.json(path);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get popular destinations
exports.getPopularDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find()
      .sort({ popularity: -1 })
      .limit(8);
    
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};