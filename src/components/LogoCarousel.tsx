import React from 'react';

const LogoCarousel = () => {
  // Array of logo images from the Logos folder
  const logos = [
    '/Logos/WhatsApp Image 2025-09-28 at 03.37.18_2d9f7d0c.jpg',
    '/Logos/WhatsApp Image 2025-09-28 at 03.37.31_a78f213f.jpg', 
    '/Logos/WhatsApp Image 2025-09-28 at 03.38.00_208616b2.jpg',
    '/Logos/WhatsApp Image 2025-09-28 at 03.39.12_572d4390.jpg',
    '/Logos/WhatsApp Image 2025-09-28 at 03.39.29_57bffad5.jpg',
    '/Logos/WhatsApp Image 2025-09-28 at 03.39.43_ee752ef7.jpg',
    '/Logos/WhatsApp Image 2025-09-28 at 03.40.11_fe1425ef.jpg',
    '/Logos/WhatsApp Image 2025-09-28 at 03.40.52_d6512b12.jpg',
    '/Logos/WhatsApp Image 2025-09-28 at 03.41.12_3b4cdc32.jpg',
    '/Logos/WhatsApp Image 2025-09-28 at 03.41.36_ad9a2061.jpg'
  ];

  return (
    <section className="relative bg-white py-12 md:py-16 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-emerald-50 px-6 py-2 rounded-full mb-4">
            <span className="text-emerald-700 text-sm font-medium">Our Partners</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Trusted Healthcare Partners
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Working with leading healthcare providers to deliver exceptional care
          </p>
        </div>

        {/* Logo Carousel Container */}
        <div className="relative">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-white to-transparent z-10"></div>
          
          {/* Carousel Track */}
          <div className="overflow-hidden">
            <div className="flex animate-scroll">
              {/* First set of logos */}
              {logos.map((logo, index) => (
                <div
                  key={`first-${index}`}
                  className="flex-shrink-0 w-32 h-20 md:w-40 md:h-24 mx-4 md:mx-6 flex items-center justify-center"
                >
                  <img
                    src={logo}
                    alt={`Partner logo ${index + 1}`}
                    className="max-w-full max-h-full object-contain transition-all duration-300"
                    loading="lazy"
                  />
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {logos.map((logo, index) => (
                <div
                  key={`second-${index}`}
                  className="flex-shrink-0 w-32 h-20 md:w-40 md:h-24 mx-4 md:mx-6 flex items-center justify-center"
                >
                  <img
                    src={logo}
                    alt={`Partner logo ${index + 1}`}
                    className="max-w-full max-h-full object-contain transition-all duration-300"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>


    </section>
  );
};

export default LogoCarousel;