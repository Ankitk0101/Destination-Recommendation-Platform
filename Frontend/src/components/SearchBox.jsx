import React, { useState, useEffect, useRef } from 'react';
import { apiService } from '../services/api';

const SearchBox = ({ onSearch, loading = false }) => {
  const [searchData, setSearchData] = useState({
    from: '',
    to: ''
  });
  const [suggestions, setSuggestions] = useState({
    from: [],
    to: []
  });
  const [activeField, setActiveField] = useState(null);
  const [suggestionsLoading, setSuggestionsLoading] = useState({
    from: false,
    to: false
  });
  const [recentSearches, setRecentSearches] = useState([]);
  
  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);

  // Load recent searches on component mount
  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    try {
      // This would be from your backend or localStorage
      const saved = localStorage.getItem('recentTravelSearches');
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load recent searches:', error);
    }
  };

  const saveRecentSearch = (from, to) => {
    try {
      const newSearch = { from, to, timestamp: new Date().toISOString() };
      const updatedSearches = [newSearch, ...recentSearches.filter(s => 
        !(s.from === from && s.to === to)
      )].slice(0, 5); // Keep only 5 most recent
      
      setRecentSearches(updatedSearches);
      localStorage.setItem('recentTravelSearches', JSON.stringify(updatedSearches));
    } catch (error) {
      console.error('Failed to save recent search:', error);
    }
  };

  // Enhanced suggestion loading with debouncing
  useEffect(() => {
    const loadSuggestions = async (field, value) => {
      if (value.length >= 2) {
        setSuggestionsLoading(prev => ({ ...prev, [field]: true }));
        try {
          const results = await apiService.searchDestinations(value);
          setSuggestions(prev => ({
            ...prev,
            [field]: results || []
          }));
        } catch (error) {
          console.error('Failed to load suggestions:', error);
          setSuggestions(prev => ({
            ...prev,
            [field]: []
          }));
        } finally {
          setSuggestionsLoading(prev => ({ ...prev, [field]: false }));
        }
      } else {
        setSuggestions(prev => ({
          ...prev,
          [field]: []
        }));
      }
    };

    if (activeField && searchData[activeField]) {
      const timer = setTimeout(() => {
        loadSuggestions(activeField, searchData[activeField]);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [searchData, activeField]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchData.from && searchData.to) {
      saveRecentSearch(searchData.from, searchData.to);
      onSearch(searchData);
    }
  };

  const handleChange = (field, value) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const selectSuggestion = (field, suggestion) => {
    setSearchData(prev => ({
      ...prev,
      [field]: suggestion.name
    }));
    setSuggestions(prev => ({
      ...prev,
      [field]: []
    }));
    setActiveField(null);
    
    // Auto-focus next field
    if (field === 'from') {
      toInputRef.current?.focus();
    }
  };

  const selectRecentSearch = (search) => {
    setSearchData({
      from: search.from,
      to: search.to
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentTravelSearches');
  };

  const getPlaceholder = (field) => {
    const examples = {
      from: ['Paris, France', 'Berlin, Germany', 'London, UK'],
      to: ['Rome, Italy', 'Prague, Czech Republic', 'Barcelona, Spain']
    };
    const randomExample = examples[field][Math.floor(Math.random() * examples[field].length)];
    return `e.g., ${randomExample}`;
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-4xl mx-auto border border-white/20 animate-float">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 text-center">
        Where would you like to go?
      </h2>
      <p className="text-gray-600 text-center mb-6">Discover the best routes across Europe</p>
      
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-0 md:flex md:space-x-4 md:items-end">
        {/* From Input */}
        <div className="flex-1 relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            From 📍
          </label>
          <div className="relative">
            <input
              ref={fromInputRef}
              type="text"
              value={searchData.from}
              onChange={(e) => handleChange('from', e.target.value)}
              onFocus={() => setActiveField('from')}
              onBlur={() => setTimeout(() => setActiveField(null), 200)}
              placeholder={getPlaceholder('from')}
              className="w-full pl-4 pr-10 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
              required
            />
            {suggestionsLoading.from && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
          
          {/* Suggestions Dropdown */}
          {suggestions.from.length > 0 && activeField === 'from' && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-y-auto">
              {suggestions.from.map((suggestion) => (
                <div
                  key={suggestion._id}
                  className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                  onMouseDown={() => selectSuggestion('from', suggestion)}
                >
                  <div className="font-medium text-gray-900">{suggestion.name}</div>
                  <div className="text-sm text-gray-600 flex items-center mt-1">
                    <span className="mr-2">📍</span>
                    {suggestion.country}
                    {suggestion.type && (
                      <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs capitalize">
                        {suggestion.type}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Swap Button */}
        <div className="flex items-end">
          <button
            type="button"
            onClick={() => setSearchData({ from: searchData.to, to: searchData.from })}
            className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
            title="Swap destinations"
          >
            ⇄
          </button>
        </div>

        {/* To Input */}
        <div className="flex-1 relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            To 🎯
          </label>
          <div className="relative">
            <input
              ref={toInputRef}
              type="text"
              value={searchData.to}
              onChange={(e) => handleChange('to', e.target.value)}
              onFocus={() => setActiveField('to')}
              onBlur={() => setTimeout(() => setActiveField(null), 200)}
              placeholder={getPlaceholder('to')}
              className="w-full pl-4 pr-10 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
              required
            />
            {suggestionsLoading.to && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
          
          {/* Suggestions Dropdown */}
          {suggestions.to.length > 0 && activeField === 'to' && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-y-auto">
              {suggestions.to.map((suggestion) => (
                <div
                  key={suggestion._id}
                  className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                  onMouseDown={() => selectSuggestion('to', suggestion)}
                >
                  <div className="font-medium text-gray-900">{suggestion.name}</div>
                  <div className="text-sm text-gray-600 flex items-center mt-1">
                    <span className="mr-2">📍</span>
                    {suggestion.country}
                    {suggestion.type && (
                      <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs capitalize">
                        {suggestion.type}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <button
            type="submit"
            disabled={loading || !searchData.from || !searchData.to}
            className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-w-[140px]"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                Searching...
              </div>
            ) : (
              'Find Routes'
            )}
          </button>
        </div>
      </form>

      {/* Recent Searches */}
      {recentSearches.length > 0 && !searchData.from && !searchData.to && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-700">Recent Searches:</span>
            <button
              onClick={clearRecentSearches}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => selectRecentSearch(search)}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors"
              >
                {search.from} → {search.to}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBox;