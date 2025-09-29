const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  arrivalTime: String,
  departureTime: String,
  duration: String,
  costFromStart: Number,
  distanceFromStart: Number
});

const transportOptionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['train', 'bus', 'flight', 'car'],
    required: true
  },
  name: String,
  cost: {
    type: Number,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  comfortLevel: {
    type: String,
    enum: ['economy', 'comfort', 'luxury'],
    default: 'comfort'
  },
  features: [String]
});

const pathSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  totalDistance: Number,
  totalDuration: String,
  stations: [stationSchema],
  transportOptions: [transportOptionSchema],
  popularity: {
    type: Number,
    default: 0
  },
  tags: [String]
});

module.exports = mongoose.model('Path', pathSchema);