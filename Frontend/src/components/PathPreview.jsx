import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const PathPreview = ({ path }) => {
  const [routeDetails, setRouteDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch detailed route information when path changes
  useEffect(() => {
    if (path && path._id) {
      fetchRouteDetails(path._id);
    }
  }, [path]);

  const fetchRouteDetails = async (pathId) => {
    setLoading(true);
    setError('');
    try {
      const details = await apiService.getPathDetails(pathId);
      setRouteDetails(details);
    } catch (err) {
      console.error('Failed to fetch route details:', err);
      setError('Failed to load route details');
    } finally {
      setLoading(false);
    }
  };

  // Save route to user favorites
  const saveToFavorites = async () => {
    if (!path?._id) return;
    
    try {
      await apiService.saveFavoriteRoute(path._id);
      // Show success message or update UI
      console.log('Route saved to favorites');
    } catch (err) {
      console.error('Failed to save favorite:', err);
      setError('Failed to save route to favorites');
    }
  };

  // Share route functionality
  const shareRoute = async () => {
    const shareData = {
      title: `Route: ${path.from} to ${path.to}`,
      text: `Check out this route from ${path.from} to ${path.to} on TravelPath!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareData.text);
        alert('Route details copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  // Calculate totals from actual data
  const getTotalPrice = () => {
    if (routeDetails?.transportOptions?.[0]?.cost) {
      return routeDetails.transportOptions[0].cost;
    }
    return path?.stations?.[path.stations.length - 1]?.price || 
           path?.stations?.[path.stations.length - 1]?.costFromStart || 
           0;
  };

  const getTotalDistance = () => {
    return routeDetails?.totalDistance || 
           path?.totalDistance || 
           path?.stations?.[path.stations.length - 1]?.distanceFromStart || 
           'Unknown';
  };

  const getTotalDuration = () => {
    return routeDetails?.totalDuration || 
           path?.totalDuration || 
           'Unknown';
  };

  if (!path) return null;

  if (loading) {
    return (
      <div className="mt-12 bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading route details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12 bg-white rounded-2xl shadow-xl p-6 md:p-8">
      {/* Header with Actions */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Suggested Route</h3>
        <div className="flex space-x-2">
          <button
            onClick={saveToFavorites}
            className="p-2 text-yellow-500 hover:bg-yellow-50 rounded-lg transition-colors"
            title="Save to favorites"
          >
            ⭐
          </button>
          <button
            onClick={shareRoute}
            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
            title="Share route"
          >
            📤
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Route Visualization */}
      <div className="relative">
        <div className="absolute left-0 top-1/2 w-full h-1 bg-blue-200 transform -translate-y-1/2"></div>
        
        <div className="relative flex justify-between items-center">
          {path.stations.map((station, index) => (
            <div key={station.id || station._id || index} className="flex flex-col items-center relative z-10">
              <div className="w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
              
              {/* Station Info */}
              <div className="mt-2 text-center">
                <div className="font-semibold text-gray-800">{station.name}</div>
                <div className="text-sm text-gray-600">
                  {station.arrivalTime || station.time}
                </div>
                <div className="text-sm font-bold text-green-600">
                  ${station.costFromStart || station.price || 0}
                </div>
                {station.duration && station.duration !== '0h' && (
                  <div className="text-xs text-gray-500 mt-1">{station.duration}</div>
                )}
              </div>
              
              {index < path.stations.length - 1 && (
                <div className="absolute top-3 left-full w-full h-0.5 bg-blue-400"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Transport Options */}
      {routeDetails?.transportOptions && routeDetails.transportOptions.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-3">Available Transport Options:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {routeDetails.transportOptions.map((option, index) => (
              <div key={index} className="p-3 bg-white rounded border">
                <div className="flex justify-between items-center">
                  <span className="font-medium capitalize">{option.type}</span>
                  <span className="text-green-600 font-bold">${option.cost}</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Duration: {option.duration} • {option.comfortLevel}
                </div>
                {option.features && (
                  <div className="text-xs text-gray-500 mt-2">
                    Features: {option.features.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Route Summary */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Total Distance</div>
          <div className="font-bold text-lg text-blue-600">{getTotalDistance()} km</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Total Price</div>
          <div className="font-bold text-lg text-green-600">${getTotalPrice()}</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Duration</div>
          <div className="font-bold text-lg text-purple-600">{getTotalDuration()}</div>
        </div>
      </div>

      {/* Additional Route Info */}
      {routeDetails?.tags && routeDetails.tags.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-600 mb-2">Route Tags:</div>
          <div className="flex flex-wrap gap-2">
            {routeDetails.tags.map((tag, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs capitalize"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PathPreview;