"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";

export default function AlbumPage() {
  const params = useParams();
  const id = params.id as string;
  const [album, setAlbum] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchAlbum();
    }
  }, [id]);

  const fetchAlbum = async () => {
    try {
      const response = await fetch(`/api/albums/${id}`);
      if (response.ok) {
        const data = await response.json();
        setAlbum(data);
      }
    } catch (error) {
      console.error("Error fetching album:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-charcoal/60">Loading...</div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-charcoal/60 mb-4">Album not found</p>
          <Link href="/photography" className="text-sage hover:text-sage/80">
            Back to Photography
          </Link>
        </div>
      </div>
    );
  }

  const albumPhotos = album.photos || [];

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-cream">
      <Navbar />
      
      {/* Header */}
      <section className="pt-24 pb-12 px-4 md:px-8 bg-gradient-to-br from-sage/10 to-sand/10">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/photography"
            className="inline-flex items-center gap-2 text-charcoal/70 hover:text-charcoal mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Photography
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-charcoal mb-4">
              {album.title}
            </h1>
            {album.description && (
              <p className="text-lg text-charcoal/70 max-w-3xl">
                {album.description}
              </p>
            )}
            <div className="flex items-center gap-4 mt-4 text-sm text-charcoal/60">
              <span>{albumPhotos.length} photos</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gallery */}
      <section id="album-gallery" className="py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {albumPhotos.length === 0 ? (
            <div className="text-center py-12 text-charcoal/60">
              No photos in this album yet.
            </div>
          ) : (
            <div className="space-y-12">
              {albumPhotos.map((albumPhoto: any, index: number) => {
                const photo = albumPhoto.photo;
                if (!photo) return null; // Skip if photo is missing
                
                const isHorizontal = albumPhoto.orientation === "horizontal";

                return (
                  <motion.div
                    key={albumPhoto.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`grid gap-8 ${
                      isHorizontal
                        ? "lg:grid-cols-2"
                        : "lg:grid-cols-[1fr_1.5fr]"
                    } items-center`}
                  >
                    {/* Image */}
                    <div
                      className={`relative ${
                        isHorizontal ? "w-full aspect-video" : "w-full aspect-[3/4]"
                      } rounded-2xl overflow-hidden bg-gray-100 shadow-lg`}
                    >
                      <Image
                        src={photo.image || "/placeholder.jpg"}
                        alt={photo.title || "Photo"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-2xl md:text-3xl font-heading font-bold text-charcoal mb-2">
                          {photo.title || "Untitled"}
                        </h3>
                        {photo.category && (
                          <p className="text-sage font-medium mb-4">{photo.category}</p>
                        )}
                        {albumPhoto.description && (
                          <p className="text-lg text-charcoal/70 leading-relaxed">
                            {albumPhoto.description}
                          </p>
                        )}
                        {photo.description && !albumPhoto.description && (
                          <p className="text-lg text-charcoal/70 leading-relaxed">
                            {photo.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}


