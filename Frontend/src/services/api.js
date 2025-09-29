const API_BASE_URL ='https://destination-recommendation-platform-1.onrender.com/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  // Remove token on logout
  removeToken() {
    this.token = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  }

  // Store user data locally
  setUserData(userData) {
    localStorage.setItem('userData', JSON.stringify(userData));
  }

  // Get user data from local storage
  getUserData() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }

  // Generic request method with enhanced error handling
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add authorization header if token exists
    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    // Add timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    config.signal = controller.signal;

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      // Handle unauthorized responses
      if (response.status === 401) {
        this.removeToken();
        // Dispatch event that can be listened to by components
        window.dispatchEvent(new Event('unauthorized'));
        throw new Error('Authentication required. Please login again.');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please check your connection.');
      }
      
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Network error. Please check your connection.');
      }
      
      throw error;
    }
  }

  // Authentication endpoints
  async register(userData) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (data.token) {
      this.setToken(data.token);
      this.setUserData(data.user);
    }
    
    return data;
  }

  async login(credentials) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (data.token) {
      this.setToken(data.token);
      this.setUserData(data.user);
    }
    
    return data;
  }

  async getProfile() {
    // Try to get from localStorage first for faster loading
    const cachedUser = this.getUserData();
    if (cachedUser) {
      // Still make API call to verify, but return cached immediately
      setTimeout(() => {
        this.request('/auth/profile')
          .then(data => this.setUserData(data.user))
          .catch(console.error);
      }, 0);
      return { user: cachedUser };
    }
    
    const data = await this.request('/auth/profile');
    this.setUserData(data.user);
    return data;
  }

  // Destination endpoints
  async searchDestinations(query) {
    if (!query || query.length < 2) return [];
    return this.request(`/destinations/search?query=${encodeURIComponent(query)}`);
  }

  async getPaths(from, to, transportType = null) {
    let url = `/destinations/paths?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
    if (transportType) {
      url += `&transportType=${transportType}`;
    }
    return this.request(url);
  }

  async getPathDetails(pathId) {
    return this.request(`/destinations/paths/${pathId}`);
  }

  async getPopularDestinations() {
    return this.request('/destinations/popular');
  }

  // User endpoints
  async updateProfile(profileData) {
    const data = await this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    
    if (data.user) {
      this.setUserData(data.user);
    }
    
    return data;
  }

  async addSearchHistory(from, to) {
    return this.request('/users/search-history', {
      method: 'POST',
      body: JSON.stringify({ from, to }),
    });
  }

  async getSearchHistory(limit = 20, page = 1) {
    return this.request(`/users/search-history?limit=${limit}&page=${page}`);
  }

  async clearSearchHistory() {
    return this.request('/users/search-history', {
      method: 'DELETE',
    });
  }

  async getUserStatistics() {
    return this.request('/users/statistics');
  }

  async updatePreferences(preferences) {
    const data = await this.request('/users/preferences', {
      method: 'PATCH',
      body: JSON.stringify(preferences),
    });
    
    if (data.preferences) {
      const currentUser = this.getUserData();
      if (currentUser) {
        this.setUserData({
          ...currentUser,
          preferences: data.preferences
        });
      }
    }
    
    return data;
  }
}

// Create singleton instance
export const apiService = new ApiService();

// Listen for unauthorized events globally
if (typeof window !== 'undefined') {
  window.addEventListener('unauthorized', () => {
    // Redirect to login or show modal
    if (window.location.pathname !== '/login') {
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
    }
  });
}
