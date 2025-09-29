import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import Navbar from '../components/Navbar';
import SearchBox from '../components/SearchBox';
import PathPreview from '../components/PathPreview';
import Footer from '../components/Footer';

const Home = () => {
  const [searchResults, setSearchResults] = useState(null);
  const [allRoutes, setAllRoutes] = useState([]);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [popularDestinations, setPopularDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  // Load popular destinations on component mount
  useEffect(() => {
    loadPopularDestinations();
  }, []);

  const loadPopularDestinations = async () => {
    try {
      const destinations = await apiService.getPopularDestinations();
      setPopularDestinations(destinations);
    } catch (error) {
      console.error('Failed to load popular destinations:', error);
    }
  };

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Actual API call to backend for routes
  const handleSearch = async (searchData) => {
    setLoading(true);
    setError('');
    
    try {
      console.log('🔍 Searching routes from:', searchData.from, 'to:', searchData.to);
      
      // Make actual API call to backend
      const paths = await apiService.getPaths(searchData.from, searchData.to);
      console.log('📡 API Response:', paths);
      
      if (paths && paths.length > 0) {
        setAllRoutes(paths);
        setSearchResults(paths[0]);
        
        // Save to search history if user is logged in
        if (user) {
          try {
            await apiService.addSearchHistory(searchData.from, searchData.to);
            console.log('✅ Search saved to history');
          } catch (historyError) {
            console.error('Failed to save search history:', historyError);
          }
        }
        
        console.log('✅ Routes found:', paths.length);
      } else {
        setSearchResults(null);
        setAllRoutes([]);
        setError('No routes found for your search. Try different cities like Paris to Rome or Berlin to Prague.');
        console.log('❌ No routes found');
      }
      
      // Smooth scroll to results
      setTimeout(() => {
        document.getElementById('search-results')?.scrollIntoView({ 
          behavior: 'smooth' 
        });
      }, 100);
      
    } catch (error) {
      console.error('❌ Search failed:', error);
      setError('Failed to search routes. Please check your connection and try again.');
      setSearchResults(null);
      setAllRoutes([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to switch between different routes
  const switchRoute = (routeIndex) => {
    setSearchResults(allRoutes[routeIndex]);
  };

  const features = [
    {
      icon: "🚀",
      title: "Instant Route Planning",
      description: "Get optimized routes with multiple stations in seconds"
    },
    {
      icon: "💰",
      title: "Price Comparison",
      description: "Compare prices across different routes and transport options"
    },
    {
      icon: "⭐",
      title: "User Reviews",
      description: "Read authentic reviews from fellow travelers"
    },
    {
      icon: "📱",
      title: "Mobile Friendly",
      description: "Plan your journey on any device, anywhere"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Frequent Traveler",
      image: "👩",
      review: "TravelPath saved me 40% on my Europe trip! The station breakdown was incredibly helpful.",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Business Traveler",
      image: "👨",
      review: "The real-time pricing and station information made my business trips so much smoother.",
      rating: 5
    },
    {
      name: "Emma Davis",
      role: "Backpacker",
      image: "👧",
      review: "Found hidden gem stations I never would have discovered otherwise. Amazing platform!",
      rating: 4
    }
  ];

  const stats = [
    { number: "50K+", label: "Happy Travelers" },
    { number: "500+", label: "Destinations" },
    { number: "10K+", label: "Routes" },
    { number: "4.9", label: "Average Rating" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight animate-fade-in">
              Discover Your 
              <span className="text-blue-400"> Perfect Journey</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
              Smart route planning with station details, real-time pricing, and authentic traveler reviews
            </p>
          </div>

          {/* Search Box */}
          <SearchBox onSearch={handleSearch} loading={loading} />

          {/* Loading State */}
          {loading && (
            <div className="mt-8 flex justify-center">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="flex items-center space-x-4 text-white">
                  <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
                  <span>Searching for the best routes across our network...</span>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-8 flex justify-center">
              <div className="bg-red-500/20 backdrop-blur-lg rounded-2xl p-6 border border-red-300 max-w-2xl">
                <div className="flex items-center space-x-3 text-red-200">
                  <span className="text-xl">⚠️</span>
                  <div>
                    <div className="font-semibold">Search Issue</div>
                    <div className="text-sm mt-1">{error}</div>
                    <div className="text-xs mt-2 text-red-300">
                      Try popular routes like: Paris → Rome, Berlin → Prague, or London → Paris
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Animated Features Carousel */}
          <div className="mt-12 max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center space-x-4 animate-pulse-slow">
                <span className="text-4xl">{features[currentFeature].icon}</span>
                <div>
                  <h3 className="text-white font-semibold text-lg">
                    {features[currentFeature].title}
                  </h3>
                  <p className="text-gray-300">{features[currentFeature].description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Results Section */}
      {searchResults && allRoutes.length > 0 && (
        <section id="search-results" className="py-20 bg-white animate-slide-up">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Route Selector */}
            {allRoutes.length > 1 && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Found {allRoutes.length} Routes
                </h3>
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {allRoutes.map((route, index) => (
                    <button
                      key={route._id || index}
                      onClick={() => switchRoute(index)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                        searchResults === route
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Route {index + 1} 
                      <span className="ml-2 text-sm opacity-75">
                        (${route.transportOptions?.[0]?.cost || route.stations?.[route.stations.length - 1]?.costFromStart || '?'} - {route.totalDuration || '?'})
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Route Preview */}
            <PathPreview path={searchResults} />
            
            {/* Route Comparison */}
            {allRoutes.length > 1 && (
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Compare All Routes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allRoutes.map((route, index) => (
                    <div 
                      key={index}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                        searchResults === route
                          ? 'border-blue-500 bg-blue-50 shadow-lg'
                          : 'border-gray-200 hover:border-blue-300 bg-white'
                      }`}
                      onClick={() => switchRoute(index)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className="font-semibold text-gray-900">Route {index + 1}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          searchResults === route 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-200 text-gray-700'
                        }`}>
                          {index === 0 ? 'Recommended' : 'Alternative'}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-medium">{route.totalDuration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Price:</span>
                          <span className="font-medium text-green-600">
                            ${route.transportOptions?.[0]?.cost || route.stations?.[route.stations.length - 1]?.costFromStart || '?'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Stops:</span>
                          <span className="font-medium">{route.stations.length - 2}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Transport:</span>
                          <span className="font-medium capitalize">
                            {route.transportOptions?.[0]?.type || 'Multiple'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Popular Destinations Section */}
      {popularDestinations.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Popular Destinations
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover trending destinations loved by travelers worldwide
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {popularDestinations.slice(0, 12).map((destination) => (
                <div 
                  key={destination._id} 
                  className="text-center group cursor-pointer transform hover:scale-105 transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-blue-600 group-hover:to-purple-700">
                    <span className="text-2xl">📍</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">{destination.name}</h3>
                  <p className="text-xs text-gray-600 mt-1">{destination.country}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-800 to-purple-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="animate-bounce-in" 
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-blue-200 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Travelers Love TravelPath
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to plan the perfect journey, all in one place
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard 
                key={index}
                icon={feature.icon} 
                title={feature.title} 
                description={feature.description}
                delay={index * 100}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Travelers Say
            </h2>
            <p className="text-lg text-gray-600">Real stories from our global community</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} delay={index * 200} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who trust TravelPath for their route planning and discovery
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/signup" 
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Get Started Free
            </Link>
            <Link 
              to="/login" 
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all duration-200 transform hover:scale-105"
            >
              Sign In to Your Account
            </Link>
          </div>
          <p className="text-blue-200 mt-6 text-sm">
            No credit card required • Plan unlimited routes • Real-time updates
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description, delay }) => {
  return (
    <div 
      className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up border border-gray-100"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:from-blue-600 group-hover:to-purple-700">
        <span className="text-3xl">{icon}</span>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
};

// Testimonial Card Component
const TestimonialCard = ({ testimonial, delay }) => {
  return (
    <div 
      className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up border border-gray-100"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-2xl mr-4">
          {testimonial.image}
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
          <p className="text-gray-600 text-sm">{testimonial.role}</p>
        </div>
      </div>
      <div className="flex mb-3">
        {[...Array(5)].map((_, i) => (
          <span 
            key={i} 
            className={`text-lg ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ⭐
          </span>
        ))}
      </div>
      <p className="text-gray-700 italic leading-relaxed">"{testimonial.review}"</p>
    </div>
  );
};

export default Home;