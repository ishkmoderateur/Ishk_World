"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Camera, Calendar, Star, ArrowRight, Mail, Phone, Image as ImageIcon, Video, Edit } from "lucide-react";

export default function PhotographyPage() {
  const portfolio = [
    {
      id: 1,
      title: "Moroccan Equestrian Art",
      category: "Cultural",
      image: "/photography/Moroccan-equestrian-art--tbourida----and-shots-that-stayed-way-too-long-in-my-camera.--yourshotp.jpg",
    },
    {
      id: 2,
      title: "Tbourida Art",
      category: "Cultural",
      image: "/photography/Moroccan-equestrian-art--tbourida----and-shots-that-stayed-way-too-long-in-my-camera.--yourshotp--1-.jpg",
    },
    {
      id: 3,
      title: "Equestrian Photography",
      category: "Cultural",
      image: "/photography/Moroccan-equestrian-art--tbourida----and-shots-that-stayed-way-too-long-in-my-camera.--yourshotp--2-.jpg",
    },
    {
      id: 4,
      title: "Sandstorm Aesthetics",
      category: "Adventure",
      image: "/photography/sandstorm-aesthetics-enduro.jpg",
    },
    {
      id: 5,
      title: "Instagram Story",
      category: "Social Media",
      image: "/photography/SnapInsta.to_285944640_749473589809454_3150065497059521760_n.jpg",
    },
    {
      id: 6,
      title: "Instagram Story",
      category: "Social Media",
      image: "/photography/SnapInsta.to_285958631_797175361278497_4156943208252385210_n.jpg",
    },
    {
      id: 7,
      title: "Instagram Story",
      category: "Social Media",
      image: "/photography/SnapInsta.to_286229915_139955931962559_4114156546180902768_n.jpg",
    },
    {
      id: 8,
      title: "Instagram Story",
      category: "Social Media",
      image: "/photography/SnapInsta.to_286264897_166436049179832_8576628153007616255_n.jpg",
    },
    {
      id: 9,
      title: "Instagram Story",
      category: "Social Media",
      image: "/photography/SnapInsta.to_286395359_1010442232943605_1364096570174400269_n.jpg",
    },
    {
      id: 10,
      title: "Instagram Story",
      category: "Social Media",
      image: "/photography/SnapInsta.to_286596297_347472930853333_5959751300077876313_n.jpg",
    },
    {
      id: 11,
      title: "Instagram Story",
      category: "Social Media",
      image: "/photography/SnapInsta.to_348482759_1118041429586596_6948911033448556305_n.jpg",
    },
    {
      id: 12,
      title: "Instagram Story",
      category: "Social Media",
      image: "/photography/SnapInsta.to_348501697_804820757676409_5029574931353129042_n.jpg",
    },
    {
      id: 13,
      title: "Instagram Story",
      category: "Social Media",
      image: "/photography/SnapInsta.to_348502222_1952458561772876_2037669789508555136_n.jpg",
    },
    {
      id: 14,
      title: "Instagram Story",
      category: "Social Media",
      image: "/photography/SnapInsta.to_348832367_282667814105577_2350016748184074076_n.jpg",
    },
    {
      id: 15,
      title: "Instagram Story",
      category: "Social Media",
      image: "/photography/SnapInsta.to_383210293_3378731082437356_2040821813781284353_n.jpg",
    },
    {
      id: 16,
      title: "Instagram Story",
      category: "Social Media",
      image: "/photography/SnapInsta.to_384121194_1225548718839850_3622562154938087237_n.jpg",
    },
    {
      id: 17,
      title: "Instagram Story",
      category: "Social Media",
      image: "/photography/SnapInsta.to_384225380_1673584376500810_7947164182321983601_n.jpg",
    },
    {
      id: 18,
      title: "Instagram Story",
      category: "Social Media",
      image: "/photography/SnapInsta.to_384513449_339403928453340_1402748163538938923_n.jpg",
    },
    {
      id: 19,
      title: "Instagram Story",
      category: "Social Media",
      image: "/photography/SnapInsta.to_384692195_325629423471897_1987290720100708418_n.jpg",
    },
    {
      id: 20,
      title: "Instagram Story",
      category: "Social Media",
      image: "/photography/SnapInsta.to_385152302_320581647291316_5138119132852301915_n.jpg",
    },
    {
      id: 21,
      title: "Instagram Story",
      category: "Social Media",
      image: "/photography/SnapInsta.to_434839034_975640473681383_3714742764191781847_n.jpg",
    },
  ];

  const services = [
    {
      id: 1,
      name: "Portrait Session",
      price: "€300",
      duration: "2 hours",
      includes: [
        "Professional photo shoot",
        "30 edited high-res images",
        "Online gallery",
        "Basic retouching",
      ],
      icon: Camera,
    },
    {
      id: 2,
      name: "Event Photography",
      price: "€500",
      duration: "4 hours",
      includes: [
        "Full event coverage",
        "100+ edited images",
        "Online gallery",
        "Same-day preview",
      ],
      icon: Calendar,
    },
    {
      id: 3,
      name: "Commercial Shoot",
      price: "€800",
      duration: "Full day",
      includes: [
        "Product/lifestyle photography",
        "200+ edited images",
        "Multiple angles",
        "Brand-ready files",
      ],
      icon: ImageIcon,
    },
    {
      id: 4,
      name: "Wedding Package",
      price: "€1,200",
      duration: "Full day",
      includes: [
        "Ceremony & reception",
        "300+ edited images",
        "Engagement session",
        "Premium album",
      ],
      icon: Star,
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: "Sarah & James",
      event: "Wedding",
      text: "Absolutely stunning photos that captured every moment perfectly. The attention to detail was incredible.",
      rating: 5,
    },
    {
      id: 2,
      name: "Maria",
      event: "Portrait Session",
      text: "The photographer made me feel so comfortable and the results exceeded all expectations.",
      rating: 5,
    },
    {
      id: 3,
      name: "EcoBrand Co.",
      event: "Commercial",
      text: "Professional, creative, and delivered exactly what we needed for our campaign. Highly recommend!",
      rating: 5,
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gold/5 via-cream to-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-amber/5 to-cream"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gold/20 mb-6">
              <Camera className="w-12 h-12 text-gold" />
            </div>
            <h1 className="text-5xl md:text-6xl font-heading font-bold text-charcoal mb-6">
              Let Us Capture the Beauty in Your Story
            </h1>
            <p className="text-xl md:text-2xl text-charcoal/70 mb-8 max-w-3xl mx-auto leading-relaxed">
              Professional photography services, shoots, edits, and retouching. Every moment deserves to be remembered beautifully.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gold text-white rounded-full font-medium hover:bg-gold/90 transition-colors flex items-center gap-2 mx-auto"
            >
              Book a Session
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-3 h-3 bg-gold/30 rounded-full"
            animate={{
              y: [0, -30, 0],
              x: [0, 10, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </section>

      {/* Portfolio Gallery */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-charcoal mb-4">
              Our Portfolio
            </h2>
            <p className="text-charcoal/60 text-lg">
              A glimpse into the stories we've captured
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolio.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="relative group cursor-pointer rounded-2xl overflow-hidden h-80"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  quality={90}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                    <span className="text-xs font-medium text-gold mb-2 block">
                      {item.category}
                    </span>
                    <h3 className="text-xl font-heading font-semibold">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 md:px-8 bg-gradient-to-br from-gold/5 to-amber/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-charcoal mb-4">
              Our Services
            </h2>
            <p className="text-charcoal/60 text-lg">
              Professional packages tailored to your needs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gold/10"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/20 mb-4">
                    <Icon className="w-8 h-8 text-gold" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-charcoal mb-2">
                    {service.name}
                  </h3>
                  <div className="text-3xl font-bold text-gold mb-2">
                    {service.price}
                  </div>
                  <div className="text-sm text-charcoal/60 mb-6">
                    {service.duration}
                  </div>
                  <ul className="space-y-2 mb-6">
                    {service.includes.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-charcoal/70">
                        <span className="text-gold mt-1">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-gold text-white rounded-full font-medium hover:bg-gold/90 transition-colors"
                  >
                    Book Now
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-charcoal mb-4">
              What Our Clients Say
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-gold/5 to-amber/5 rounded-2xl p-6 border border-gold/10"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-gold fill-gold"
                    />
                  ))}
                </div>
                <p className="text-charcoal/70 mb-4 leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div>
                  <div className="font-semibold text-charcoal">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-charcoal/60">
                    {testimonial.event}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-16 px-4 md:px-8 bg-gradient-to-br from-gold/5 to-amber/5">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/20 mb-4">
              <Calendar className="w-8 h-8 text-gold" />
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-charcoal mb-4">
              Book Your Session
            </h2>
            <p className="text-charcoal/60 text-lg">
              Let's discuss your vision and create something beautiful together
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gold/10"
          >
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-gold/20 focus:outline-none focus:ring-2 focus:ring-gold/50"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-lg border border-gold/20 focus:outline-none focus:ring-2 focus:ring-gold/50"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 rounded-lg border border-gold/20 focus:outline-none focus:ring-2 focus:ring-gold/50"
                  placeholder="+33 6 12 34 56 78"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 rounded-lg border border-gold/20 focus:outline-none focus:ring-2 focus:ring-gold/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Service Type
                  </label>
                  <select className="w-full px-4 py-3 rounded-lg border border-gold/20 focus:outline-none focus:ring-2 focus:ring-gold/50">
                    <option>Portrait Session</option>
                    <option>Event Photography</option>
                    <option>Commercial Shoot</option>
                    <option>Wedding Package</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Tell us about your project
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gold/20 focus:outline-none focus:ring-2 focus:ring-gold/50"
                  placeholder="What kind of photography do you need? Any specific requirements or ideas?"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-4 bg-gold text-white rounded-full font-medium hover:bg-gold/90 transition-colors"
              >
                Send Inquiry
              </motion.button>

              <p className="text-center text-sm text-charcoal/60">
                We'll respond within 24 hours to discuss your project
              </p>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/20 mb-4">
                <Edit className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-charcoal mb-2">
                Professional Editing
              </h3>
              <p className="text-charcoal/60">
                Every image is carefully edited to perfection, ensuring the highest quality results
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/20 mb-4">
                <ImageIcon className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-charcoal mb-2">
                High-Resolution Files
              </h3>
              <p className="text-charcoal/60">
                Receive all images in high-resolution format, perfect for printing and sharing
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/20 mb-4">
                <Video className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-charcoal mb-2">
                Video Services
              </h3>
              <p className="text-charcoal/60">
                We also offer video production services for events, commercials, and more
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
