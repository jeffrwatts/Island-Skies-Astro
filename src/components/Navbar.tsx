'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { config } from '@/lib/config';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
            <Image 
              src="/logo-white.png" 
              alt="Island Skies Astro Logo" 
              width={80} 
              height={80}
              className="h-12 w-auto sm:h-16"
            />
            <div className="flex flex-col">
              <span className="text-white font-semibold text-lg sm:text-xl font-cinzel">{config.siteName}</span>
              <span className="text-gray-300 text-xs sm:text-sm hidden sm:block">Astrophotography by Jeff Ray Watts</span>
            </div>
          </Link>
          
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link 
              href="/" 
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Gallery
            </Link>
            <Link 
              href="/articles" 
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Articles
            </Link>
            <Link 
              href="/about" 
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              About
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none focus:text-white"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800 rounded-md mt-2">
              <Link 
                href="/" 
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Gallery
              </Link>
              <Link 
                href="/articles" 
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Articles
              </Link>
              <Link 
                href="/about" 
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
