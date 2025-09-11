export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero section with starfield background */}
      <div className="relative bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-16">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">About Island Skies Astro</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Capturing the cosmos from the pristine skies of Hawaii, where the stars shine brighter and the universe feels closer.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Bio section */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">My Story</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  Living in Hawaii has given me access to some of the darkest skies in the world. 
                  From the volcanic peaks of Mauna Kea to the coastal plains of Kona, I&apos;ve been 
                  capturing the beauty of the night sky for over a decade.
                </p>
                <p>
                  My journey in astrophotography began with a simple DSLR and a basic telescope. 
                  Over the years, I&apos;ve refined my techniques and upgraded my equipment, but the 
                  wonder of capturing distant galaxies and nebulae never fades.
                </p>
                <p>
                  This gallery represents years of dedication to the craft, countless hours 
                  under the stars, and the endless pursuit of that perfect shot that captures 
                  the majesty of our universe.
                </p>
              </div>
            </div>
            
            {/* Placeholder for photographer photo */}
            <div className="relative">
              <div className="aspect-square bg-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-gray-500 text-lg">Photographer Photo</span>
              </div>
            </div>
          </div>
        </section>

        {/* Equipment sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* DSO Equipment */}
          <section className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-white mb-4">Deep Sky Objects</h3>
            <div className="space-y-3 text-gray-300">
              <div>
                <span className="font-semibold text-white">Telescope:</span> Celestron EdgeHD 11&ldquo;
              </div>
              <div>
                <span className="font-semibold text-white">Mount:</span> Celestron CGX-L
              </div>
              <div>
                <span className="font-semibold text-white">Camera:</span> ZWO ASI2600MM Pro
              </div>
              <div>
                <span className="font-semibold text-white">Filters:</span> Chroma LRGB, Ha, OIII, SII
              </div>
              <div>
                <span className="font-semibold text-white">Guide Scope:</span> ZWO 60mm + ASI290MM Mini
              </div>
            </div>
          </section>

          {/* Planetary Equipment */}
          <section className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-white mb-4">Planetary</h3>
            <div className="space-y-3 text-gray-300">
              <div>
                <span className="font-semibold text-white">Telescope:</span> Celestron C14
              </div>
              <div>
                <span className="font-semibold text-white">Mount:</span> Celestron CGX-L
              </div>
              <div>
                <span className="font-semibold text-white">Camera:</span> ZWO ASI462MC
              </div>
              <div>
                <span className="font-semibold text-white">Barlow:</span> Tele Vue 2x Powermate
              </div>
              <div>
                <span className="font-semibold text-white">Filters:</span> Baader UV/IR Cut, LRGB
              </div>
            </div>
          </section>
        </div>

        {/* Locations */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Observing Locations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Mauna Kea</h3>
              <p className="text-gray-300">
                At 13,800 feet elevation, Mauna Kea offers some of the best observing conditions 
                on Earth. The thin atmosphere and minimal light pollution make it ideal for 
                deep sky imaging.
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Kona Coast</h3>
              <p className="text-gray-300">
                The coastal plains of Kona provide excellent seeing conditions for planetary 
                imaging. The stable air and consistent temperatures create ideal conditions 
                for high-resolution planetary photography.
              </p>
            </div>
          </div>
        </section>

        {/* Social Links */}
        <section className="text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Connect With Me</h2>
          <div className="flex justify-center space-x-6">
            <a 
              href="https://www.astrobin.com/users/jwatts/" 
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              AstroBin
            </a>
            <a 
              href="https://instagram.com/jwatts" 
              className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
            <a 
              href="https://github.com/jwatts" 
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
