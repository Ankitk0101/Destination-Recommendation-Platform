import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-blue-400">🌍 TravelPath</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Your trusted companion for smart travel planning. Discover routes, compare prices, 
              and read reviews from fellow travelers.
            </p>
            <div className="flex space-x-4">
              <SocialIcon icon="📘" label="Facebook" />
              <SocialIcon icon="🐦" label="Twitter" />
              <SocialIcon icon="📷" label="Instagram" />
              <SocialIcon icon="💼" label="LinkedIn" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <FooterLink href="/">Home</FooterLink>
              <FooterLink href="/destinations">Destinations</FooterLink>
              <FooterLink href="/routes">Routes</FooterLink>
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              <FooterLink href="/help">Help Center</FooterLink>
              <FooterLink href="/faq">FAQ</FooterLink>
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/terms">Terms of Service</FooterLink>
              <FooterLink href="/contact">Contact Support</FooterLink>
            </ul>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="font-semibold mb-2">Stay Updated</h3>
              <p className="text-gray-400">Get the latest travel tips and offers</p>
            </div>
            <div className="flex space-x-2 w-full md:w-auto">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              />
              <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; 2024 TravelPath. All rights reserved. Made with ❤️ for travelers.</p>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon, label }) => {
  return (
    <button 
      className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-200"
      aria-label={label}
    >
      <span className="text-lg">{icon}</span>
    </button>
  );
};

const FooterLink = ({ href, children }) => {
  return (
    <li>
      <Link 
        to={href} 
        className="text-gray-400 hover:text-white transition-colors duration-200"
      >
        {children}
      </Link>
    </li>
  );
};

export default Footer;