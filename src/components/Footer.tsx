import { config } from '@/lib/config';

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm">
            © {new Date().getFullYear()} {config.siteName}. All rights reserved.
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a 
              href="https://github.com/jwatts" 
              className="text-gray-400 hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a 
              href="https://www.astrobin.com/users/jwatts/" 
              className="text-gray-400 hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              AstroBin
            </a>
            <a 
              href="https://instagram.com/jwatts" 
              className="text-gray-400 hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
