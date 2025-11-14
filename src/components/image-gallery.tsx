"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function ImageGallery() {
  // Real images from Unsplash - high quality, free to use
  const galleryImages = [
    {
      id: 1,
      title: "Garden Moments",
      description: "Peaceful moments in nature",
      src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80&auto=format&fit=crop",
      alt: "Beautiful garden with flowers and greenery",
    },
    {
      id: 2,
      title: "Slow Living",
      description: "Mindful daily rituals",
      src: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80&auto=format&fit=crop",
      alt: "Peaceful morning scene with coffee and plants",
    },
    {
      id: 3,
      title: "Community",
      description: "Connecting with others",
      src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80&auto=format&fit=crop",
      alt: "People gathering in a beautiful outdoor setting",
    },
    {
      id: 4,
      title: "Nature",
      description: "Embracing the outdoors",
      src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80&auto=format&fit=crop",
      alt: "Serene forest path in natural light",
    },
  ];

  return (
    <section className="py-24 px-4 md:px-8 bg-gradient-to-b from-white to-cream">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-charcoal mb-4">
            Moments That Matter
          </h2>
          <p className="text-lg text-stone max-w-2xl mx-auto">
            Capturing the essence of slow living through authentic experiences
          </p>
        </motion.div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {galleryImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-3xl aspect-[4/3] cursor-pointer"
            >
              {/* Real Image */}
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                quality={85}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              
              {/* Text Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/40 to-transparent flex items-end p-8 z-10">
                <div>
                  <p className="text-white font-medium text-lg mb-1">{image.title}</p>
                  <p className="text-white/80 text-sm">{image.description}</p>
                </div>
              </div>

              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
              
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-4 left-4 w-32 h-32 bg-white/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-lg text-charcoal/70 mb-6">
            Ready to start your journey toward mindful living?
          </p>
          <motion.button
            onClick={() => {
              const servicesSection = document.getElementById('services-section');
              if (servicesSection) {
                servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Our Services
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

