const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['city', 'town', 'village', 'landmark'],
    required: true
  },
  country: {
    type: String,
    required: true
  },
  coordinates: {
    lat: Number,
    lng: Number
  },
  popularity: {
    type: Number,
    default: 0
  },
  tags: [String]
});


destinationSchema.index({ name: 'text', country: 'text' });

module.exports = mongoose.model('Destination', destinationSchema);