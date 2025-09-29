import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// NavLink Component for desktop
const NavLink = ({ href, children, active = false, scrolled }) => {
  return (
    <Link
      to={href}
      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 relative group ${
        scrolled 
          ? active 
            ? 'text-blue-600 bg-blue-50' 
            : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
          : active
            ? 'text-white bg-white/20'
            : 'text-white hover:text-gray-200 hover:bg-white/10'
      }`}
    >
      {children}
      {/* Hover underline effect */}
      <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-200 group-hover:w-full ${
        active ? 'w-full' : ''
      }`}></span>
    </Link>
  );
};

// Mobile NavLink Component
const MobileNavLink = ({ href, children, active = false }) => {
  return (
    <Link
      to={href}
      className={`block px-3 py-2 rounded-md font-medium transition-colors duration-200 ${
        active 
          ? 'text-blue-600 bg-blue-50' 
          : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
      }`}
    >
      {children}
    </Link>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
  };

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-lg py-2' : 'bg-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <span className={`text-2xl font-bold transition-colors duration-300 ${
                scrolled ? 'text-blue-600' : 'text-white'
              }`}>
                🌍 TravelPath
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink scrolled={scrolled} href="/" active={true}>Home</NavLink>
            {/* <NavLink scrolled={scrolled} href="/destinations">Destinations</NavLink> */}
            
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    scrolled 
                      ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50' 
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <span>👤</span>
                  <span>{user.name}</span>
                  <span>▼</span>
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    scrolled 
                      ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50' 
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
                    scrolled 
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' 
                      : 'bg-white text-blue-600 hover:bg-gray-100'
                  }`}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md transition-colors duration-200 ${
                scrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-gray-200'
              } focus:outline-none`}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white rounded-lg mt-4 shadow-lg">
            <MobileNavLink href="/" active={true}>Home</MobileNavLink>
            <MobileNavLink href="/destinations">Destinations</MobileNavLink>
            
            {user ? (
              <>
                <MobileNavLink href="/profile">Profile</MobileNavLink>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200 rounded-md"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <MobileNavLink href="/login">Sign In</MobileNavLink>
                <MobileNavLink href="/signup">Sign Up</MobileNavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;