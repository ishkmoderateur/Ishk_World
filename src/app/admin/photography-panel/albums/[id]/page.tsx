"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, X, Trash2, Image as ImageIcon, Maximize2, Minimize2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function EditAlbumPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [album, setAlbum] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [albumPhotos, setAlbumPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddPhoto, setShowAddPhoto] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string>("");
  const [photoFormData, setPhotoFormData] = useState({
    orientation: "horizontal",
    description: "",
    order: 0,
  });

  useEffect(() => {
    if (id) {
      fetchAlbum();
      fetchAllPhotos();
    }
  }, [id]);

  const fetchAlbum = async () => {
    try {
      const response = await fetch(`/api/admin/albums/${id}`);
      if (response.ok) {
        const data = await response.json();
        setAlbum(data);
        setAlbumPhotos(Array.isArray(data.photos) ? data.photos : []);
      }
    } catch (error) {
      console.error("Error fetching album:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllPhotos = async () => {
    try {
      const response = await fetch("/api/admin/photography");
      if (response.ok) {
        const data = await response.json();
        setPhotos(data);
      }
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  };

  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPhoto) return;

    if (albumPhotos.length >= 10) {
      alert("Album can only contain a maximum of 10 photos");
      return;
    }

    try {
      const response = await fetch(`/api/admin/albums/${id}/photos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          photoId: selectedPhoto,
          orientation: photoFormData.orientation,
          description: photoFormData.description,
          order: albumPhotos.length,
        }),
      });

      if (response.ok) {
        fetchAlbum();
        setSelectedPhoto("");
        setPhotoFormData({ orientation: "horizontal", description: "", order: 0 });
        setShowAddPhoto(false);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to add photo");
      }
    } catch (error) {
      console.error("Error adding photo:", error);
      alert("Error adding photo");
    }
  };

  const handleUpdatePhoto = async (albumPhotoId: string, updates: any) => {
    try {
      const response = await fetch(`/api/admin/albums/${id}/photos`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          albumPhotoId,
          ...updates,
        }),
      });

      if (response.ok) {
        fetchAlbum();
      }
    } catch (error) {
      console.error("Error updating photo:", error);
    }
  };

  const handleRemovePhoto = async (albumPhotoId: string) => {
    if (!confirm("Remove this photo from the album?")) return;
    try {
      const response = await fetch(
        `/api/admin/albums/${id}/photos?albumPhotoId=${albumPhotoId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        fetchAlbum();
      }
    } catch (error) {
      console.error("Error removing photo:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-charcoal/60">Loading...</div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-charcoal/60 mb-4">Album not found</p>
          <Link
            href="/admin/photography-panel"
            className="text-sage hover:text-sage/80"
          >
            Back to Photography Panel
          </Link>
        </div>
      </div>
    );
  }

  const availablePhotos = photos.filter(
    (photo) => !albumPhotos.some((ap: any) => ap.photoId === photo.id)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-sage/10 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/photography-panel"
              className="p-2 text-charcoal/70 hover:text-charcoal transition-colors rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-display font-bold text-charcoal">
                {album.title}
              </h1>
              <p className="text-sm text-charcoal/60 mt-1">
                {albumPhotos.length} / 10 photos
              </p>
            </div>
            <div className="ml-auto">
              {albumPhotos.length < 10 && (
                <button
                  onClick={() => setShowAddPhoto(!showAddPhoto)}
                  className="px-6 py-3 bg-gold text-white rounded-xl font-medium hover:bg-gold/90 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Photo
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Add Photo Form */}
        {showAddPhoto && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 border border-sage/10 shadow-sm mb-8"
          >
            <h2 className="text-2xl font-heading font-bold text-charcoal mb-6">
              Add Photo to Album
            </h2>
            <form onSubmit={handleAddPhoto} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Select Photo *
                </label>
                <select
                  value={selectedPhoto}
                  onChange={(e) => setSelectedPhoto(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                  required
                >
                  <option value="">Choose a photo...</option>
                  {availablePhotos.map((photo) => (
                    <option key={photo.id} value={photo.id}>
                      {photo.title} ({photo.category})
                    </option>
                  ))}
                </select>
                {availablePhotos.length === 0 && (
                  <p className="text-sm text-charcoal/60 mt-2">
                    All available photos are already in this album
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Orientation *
                </label>
                <select
                  value={photoFormData.orientation}
                  onChange={(e) =>
                    setPhotoFormData({
                      ...photoFormData,
                      orientation: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                  required
                >
                  <option value="horizontal">Horizontal</option>
                  <option value="vertical">Vertical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Description
                </label>
                <textarea
                  value={photoFormData.description}
                  onChange={(e) =>
                    setPhotoFormData({
                      ...photoFormData,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                  rows={4}
                  placeholder="Add a description for this photo in the album..."
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={!selectedPhoto || availablePhotos.length === 0}
                  className="px-6 py-3 bg-gold text-white rounded-xl font-medium hover:bg-gold/90 transition-colors disabled:opacity-50"
                >
                  Add to Album
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddPhoto(false);
                    setSelectedPhoto("");
                    setPhotoFormData({
                      orientation: "horizontal",
                      description: "",
                      order: 0,
                    });
                  }}
                  className="px-6 py-3 border border-sage/20 text-charcoal rounded-xl font-medium hover:bg-sage/10 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Album Photos Display */}
        <div className="bg-white rounded-2xl p-8 border border-sage/10 shadow-sm">
          <h2 className="text-2xl font-heading font-bold text-charcoal mb-6">
            Album Photos
          </h2>
          {albumPhotos.length === 0 ? (
            <div className="text-center py-12 text-charcoal/60">
              No photos in this album yet. Add your first photo!
            </div>
          ) : (
            <div className="space-y-8">
              {albumPhotos.map((albumPhoto: any, index: number) => {
                const photo = albumPhoto.photo;
                const isHorizontal = albumPhoto.orientation === "horizontal";

                return (
                  <motion.div
                    key={albumPhoto.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`grid gap-6 ${
                      isHorizontal
                        ? "lg:grid-cols-2"
                        : "lg:grid-cols-[1fr_2fr]"
                    } items-center border border-sage/10 rounded-xl p-6`}
                  >
                    {/* Image */}
                    <div
                      className={`relative ${
                        isHorizontal ? "w-full aspect-video" : "w-full aspect-[3/4]"
                      } rounded-xl overflow-hidden bg-gray-100`}
                    >
                      <Image
                        src={photo.image}
                        alt={photo.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Description & Controls */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-heading font-semibold text-charcoal mb-2">
                          {photo.title}
                        </h3>
                        <p className="text-sm text-charcoal/60 mb-4">
                          {photo.category} • {isHorizontal ? "Horizontal" : "Vertical"}
                        </p>
                        <div>
                          <label className="block text-sm font-medium text-charcoal mb-2">
                            Description
                          </label>
                          <textarea
                            value={albumPhoto.description || ""}
                            onChange={(e) =>
                              handleUpdatePhoto(albumPhoto.id, {
                                description: e.target.value,
                              })
                            }
                            onBlur={(e) =>
                              handleUpdatePhoto(albumPhoto.id, {
                                description: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                            rows={4}
                            placeholder="Add a description..."
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div>
                          <label className="block text-sm font-medium text-charcoal mb-2">
                            Orientation
                          </label>
                          <select
                            value={albumPhoto.orientation}
                            onChange={(e) =>
                              handleUpdatePhoto(albumPhoto.id, {
                                orientation: e.target.value,
                              })
                            }
                            className="px-4 py-2 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                          >
                            <option value="horizontal">Horizontal</option>
                            <option value="vertical">Vertical</option>
                          </select>
                        </div>
                        <button
                          onClick={() => handleRemovePhoto(albumPhoto.id)}
                          className="p-2 text-coral hover:bg-coral/10 rounded-lg transition-colors mt-6"
                          title="Remove from album"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

