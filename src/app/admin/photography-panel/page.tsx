"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Camera, ArrowLeft, Image as ImageIcon, Grid3x3, LayoutGrid, Folder, FolderPlus, Download } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import PhotographyGallery from "@/components/photography-gallery";
import { useLanguage } from "@/contexts/language-context";

export default function PhotographyPanel() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"photos" | "albums">("photos");
  const [photos, setPhotos] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showAlbumForm, setShowAlbumForm] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    image: "",
    description: "",
    featured: false,
    order: 0,
  });
  const [albumFormData, setAlbumFormData] = useState({
    title: "",
    description: "",
    coverImage: "",
    order: 0,
  });
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importType, setImportType] = useState<"instagram" | "urls" | "files">("instagram");
  const [importInput, setImportInput] = useState("");
  const [importAlbumTitle, setImportAlbumTitle] = useState("");

  useEffect(() => {
    fetchPhotos();
    fetchAlbums();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await fetch("/api/admin/photography");
      if (response.ok) {
        const data = await response.json();
        setPhotos(data);
      }
    } catch (error) {
      console.error("Error fetching photos:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAlbums = async () => {
    try {
      const response = await fetch("/api/admin/albums");
      if (response.ok) {
        const data = await response.json();
        setAlbums(data);
      }
    } catch (error) {
      console.error("Error fetching albums:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = "/api/admin/photography";
      const method = "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchPhotos();
        resetForm();
      }
    } catch (error) {
      console.error("Error saving photo:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;
    try {
      const response = await fetch(`/api/admin/photography/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchPhotos();
      }
    } catch (error) {
      console.error("Error deleting photo:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      image: "",
      description: "",
      featured: false,
      order: 0,
    });
    setShowForm(false);
  };

  const handleAlbumSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create album first
      const response = await fetch("/api/admin/albums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(albumFormData),
      });

      if (response.ok) {
        const newAlbum = await response.json();
        
        // Add selected photos to album
        if (selectedPhotos.length > 0) {
          const maxPhotos = Math.min(selectedPhotos.length, 10);
          for (let i = 0; i < maxPhotos; i++) {
            await fetch(`/api/admin/albums/${newAlbum.id}/photos`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                photoId: selectedPhotos[i],
                orientation: "horizontal",
                description: "",
                order: i,
              }),
            });
          }
        }

        fetchAlbums();
        setAlbumFormData({
          title: "",
          description: "",
          coverImage: "",
          order: 0,
        });
        setSelectedPhotos([]);
        setShowAlbumForm(false);
      }
    } catch (error) {
      console.error("Error creating album:", error);
    }
  };

  const togglePhotoSelection = (photoId: string) => {
    if (selectedPhotos.includes(photoId)) {
      setSelectedPhotos(selectedPhotos.filter((id) => id !== photoId));
    } else {
      if (selectedPhotos.length < 10) {
        setSelectedPhotos([...selectedPhotos, photoId]);
      } else {
        alert(t("admin.photography.panel.alerts.maxPhotos"));
      }
    }
  };

  const handleImportFromInstagram = async (profileUrl: string, albumTitle: string) => {
    if (!profileUrl || !profileUrl.includes("instagram.com")) {
      alert(t("admin.photography.panel.alerts.invalidInstagramUrl"));
      return;
    }

    if (!albumTitle) {
      alert(t("admin.photography.panel.alerts.albumTitleRequired"));
      return;
    }

    try {
      // Fetch image URLs from Instagram profile
      const response = await fetch("/api/admin/instagram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileUrl: profileUrl,
          albumTitle: albumTitle,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Failed to fetch Instagram images");
        return;
      }

      const data = await response.json();
      const imageUrls = data.imageUrls;

      if (imageUrls.length === 0) {
        alert("No images found on this Instagram profile");
        return;
      }

      // Create album first
      const albumResponse = await fetch("/api/admin/albums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: albumTitle,
          description: `Imported from Instagram: ${profileUrl}`,
          coverImage: imageUrls[0] || "",
          order: 0,
        }),
      });

      if (!albumResponse.ok) {
        alert("Failed to create album");
        return;
      }

      const newAlbum = await albumResponse.json();

      // Process each image URL
      let successCount = 0;
      for (let i = 0; i < imageUrls.length; i++) {
        const url = imageUrls[i];
        
        try {
          // Fetch image from URL (server-side will handle CORS)
          const imageResponse = await fetch(`/api/admin/download-image?url=${encodeURIComponent(url)}`);
          if (!imageResponse.ok) {
            console.error(`Failed to download image from ${url}`);
            continue;
          }

          const imageData = await imageResponse.json();
          const base64 = imageData.base64;

          // Extract title from URL
          const urlParts = url.split("/");
          const filename = urlParts[urlParts.length - 1].split("?")[0] || `instagram-${i + 1}`;
          const title = filename.replace(/\.[^/.]+$/, "") || `Instagram Image ${i + 1}`;

          // Create photo entry
          const photoResponse = await fetch("/api/admin/photography", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: title,
              category: "Instagram",
              image: base64,
              description: `Imported from Instagram`,
              featured: false,
              order: i,
            }),
          });

          if (photoResponse.ok) {
            const newPhoto = await photoResponse.json();

            // Add photo to album
            await fetch(`/api/admin/albums/${newAlbum.id}/photos`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                photoId: newPhoto.id,
                orientation: "horizontal",
                description: "",
                order: i,
              }),
            });
            successCount++;
          }
        } catch (error) {
          console.error(`Error processing image ${url}:`, error);
        }
      }

      fetchPhotos();
      fetchAlbums();
      alert(`Successfully imported ${successCount} images from Instagram and created album "${albumTitle}"!`);
    } catch (error) {
      console.error("Error importing from Instagram:", error);
      alert("Error importing from Instagram. Please try again.");
    }
  };

  const handleImportFromUrls = async (urlsText: string, albumTitle: string) => {
    const urls = urlsText
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url.length > 0 && (url.startsWith("http://") || url.startsWith("https://")));

    if (urls.length === 0) {
      alert(t("admin.photography.panel.alerts.noValidUrls"));
      return;
    }

    if (urls.length > 10) {
      alert(t("admin.photography.panel.alerts.maxImages"));
      return;
    }

    if (!albumTitle) {
      alert(t("admin.photography.panel.alerts.albumTitleRequired"));
      return;
    }

    try {
      // Create album first
      const albumResponse = await fetch("/api/admin/albums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: albumTitle,
          description: "",
          coverImage: "",
          order: 0,
        }),
      });

      if (!albumResponse.ok) {
        alert("Failed to create album");
        return;
      }

      const newAlbum = await albumResponse.json();

      // Process each URL
      for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        
        try {
          // Fetch image from URL
          const imageResponse = await fetch(url);
          if (!imageResponse.ok) {
            console.error(`Failed to fetch image from ${url}`);
            continue;
          }

          const blob = await imageResponse.blob();
          
          // Convert blob to base64
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });

          // Extract filename from URL or use default
          const urlParts = url.split("/");
          const filename = urlParts[urlParts.length - 1].split("?")[0] || `image-${i + 1}`;
          const title = filename.replace(/\.[^/.]+$/, "") || `Imported Image ${i + 1}`;

          // Create photo entry
          const photoResponse = await fetch("/api/admin/photography", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: title,
              category: "Imported",
              image: base64,
              description: `Imported from: ${url}`,
              featured: false,
              order: i,
            }),
          });

          if (photoResponse.ok) {
            const newPhoto = await photoResponse.json();

            // Add photo to album
            await fetch(`/api/admin/albums/${newAlbum.id}/photos`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                photoId: newPhoto.id,
                orientation: "horizontal",
                description: "",
                order: i,
              }),
            });
          }
        } catch (error) {
          console.error(`Error processing URL ${url}:`, error);
        }
      }

      fetchPhotos();
      fetchAlbums();
      alert(`Successfully imported ${urls.length} images from URLs and created album "${albumTitle}"!`);
    } catch (error) {
      console.error("Error importing from URLs:", error);
      alert("Error importing images from URLs. Please try again.");
    }
  };

  const handleImportImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (files.length > 10) {
      alert("Maximum 10 images per album");
      e.target.value = "";
      return;
    }

    // Show modal for album title
    setImportType("files");
    setImportInput("");
    setImportAlbumTitle("");
    setShowImportModal(true);
    
    // Store files temporarily
    (window as any).__pendingImportFiles = files;
    e.target.value = "";
  };

  const handleImportSubmit = async () => {
    if (!importAlbumTitle.trim()) {
      alert(t("admin.photography.panel.alerts.enterAlbumTitle"));
      return;
    }

    if (importType === "instagram") {
      if (!importInput.trim() || !importInput.includes("instagram.com")) {
        alert(t("admin.photography.panel.alerts.enterInstagramUrl"));
        return;
      }
      setShowImportModal(false);
      await handleImportFromInstagram(importInput.trim(), importAlbumTitle.trim());
    } else if (importType === "urls") {
      if (!importInput.trim()) {
        alert(t("admin.photography.panel.alerts.enterUrls"));
        return;
      }
      setShowImportModal(false);
      await handleImportFromUrls(importInput.trim(), importAlbumTitle.trim());
    } else {
      // Handle file import
      const files = (window as any).__pendingImportFiles;
      if (!files || files.length === 0) {
        alert(t("admin.photography.panel.alerts.noFilesSelected"));
        return;
      }
      setShowImportModal(false);
      await handleImportFiles(files, importAlbumTitle.trim());
    }

    setImportInput("");
    setImportAlbumTitle("");
    setImportType("instagram");
  };

  const handleImportFiles = async (files: File[], albumTitle: string) => {

    try {
      // Create album first
      const albumResponse = await fetch("/api/admin/albums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: albumTitle,
          description: "",
          coverImage: "",
          order: 0,
        }),
      });

      if (!albumResponse.ok) {
        alert("Failed to create album");
        e.target.value = "";
        return;
      }

      const newAlbum = await albumResponse.json();

      // Process each image
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Convert image to base64
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        // Create photo entry
        const photoResponse = await fetch("/api/admin/photography", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
            category: "Imported",
            image: base64, // Store as base64 data URL
            description: "",
            featured: false,
            order: i,
          }),
        });

        if (photoResponse.ok) {
          const newPhoto = await photoResponse.json();

          // Add photo to album
          await fetch(`/api/admin/albums/${newAlbum.id}/photos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              photoId: newPhoto.id,
              orientation: "horizontal",
              description: "",
              order: i,
            }),
          });
        }
      }

      fetchPhotos();
      fetchAlbums();
      alert(`Successfully imported ${files.length} images and created album "${albumTitle}"!`);
    } catch (error) {
      console.error("Error importing images:", error);
      alert("Error importing images. Please try again.");
    }

    e.target.value = "";
  };

  const handleImportAlbum = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const importData = JSON.parse(text);

      // Validate import data structure
      if (!importData.title || !Array.isArray(importData.photos)) {
        alert("Invalid album file format");
        return;
      }

      if (importData.photos.length > 10) {
        alert("Album can only contain maximum 10 photos");
        return;
      }

      // Create album
      const response = await fetch("/api/admin/albums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: importData.title,
          description: importData.description || "",
          coverImage: importData.coverImage || "",
          order: importData.order || 0,
        }),
      });

      if (response.ok) {
        const newAlbum = await response.json();

        // Add photos to album
        for (let i = 0; i < importData.photos.length; i++) {
          const photoData = importData.photos[i];
          // Find photo by title or image path
          const photo = photos.find(
            (p) => p.title === photoData.title || p.image === photoData.image
          );

          if (photo) {
            await fetch(`/api/admin/albums/${newAlbum.id}/photos`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                photoId: photo.id,
                orientation: photoData.orientation || "horizontal",
                description: photoData.description || "",
                order: i,
              }),
            });
          }
        }

        fetchAlbums();
        alert("Album imported successfully!");
      }
    } catch (error) {
      console.error("Error importing album:", error);
      alert("Error importing album. Please check the file format.");
    }

    // Reset file input
    e.target.value = "";
  };

  const handleDeleteAlbum = async (id: string) => {
    if (!confirm("Are you sure you want to delete this album?")) return;
    try {
      const response = await fetch(`/api/admin/albums/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchAlbums();
      }
    } catch (error) {
      console.error("Error deleting album:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-charcoal/60">{t("admin.photography.panel.messages.loading")}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-sage/10 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="p-2 text-charcoal/70 hover:text-charcoal transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-display font-bold text-charcoal flex items-center gap-3">
                  <Camera className="w-8 h-8" />
                  {t("admin.photography.panel.title")}
                </h1>
                <p className="text-charcoal/60 mt-1">{t("admin.photography.panel.subtitle")}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {activeTab === "photos" && (
                <>
                  <button
                    onClick={() => setShowGallery(!showGallery)}
                    className="px-6 py-3 border border-sage/20 text-charcoal rounded-xl font-medium hover:bg-sage/10 transition-colors flex items-center gap-2"
                  >
                    <LayoutGrid className="w-5 h-5" />
                    {showGallery ? t("admin.photography.panel.buttons.hideGallery") : t("admin.photography.panel.buttons.viewGallery")}
                  </button>
                  <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-6 py-3 bg-gold text-white rounded-xl font-medium hover:bg-gold/90 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    {showForm ? t("common.cancel") : t("admin.photography.panel.buttons.addPhoto")}
                  </button>
                </>
              )}
              {activeTab === "albums" && (
                <div className="flex gap-3">
                  <label className="px-6 py-3 border border-sage/20 text-charcoal rounded-xl font-medium hover:bg-sage/10 transition-colors flex items-center gap-2 cursor-pointer">
                    <Download className="w-5 h-5" />
                    {t("admin.photography.panel.buttons.importImages")}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImportImages}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={() => {
                      setImportType("instagram");
                      setImportInput("");
                      setImportAlbumTitle("");
                      setShowImportModal(true);
                    }}
                    className="px-6 py-3 border border-sage/20 text-charcoal rounded-xl font-medium hover:bg-sage/10 transition-colors flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    {t("admin.photography.panel.buttons.importInstagram")}
                  </button>
                  <button
                    onClick={() => {
                      setImportType("urls");
                      setImportInput("");
                      setImportAlbumTitle("");
                      setShowImportModal(true);
                    }}
                    className="px-6 py-3 border border-sage/20 text-charcoal rounded-xl font-medium hover:bg-sage/10 transition-colors flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    {t("admin.photography.panel.buttons.importUrls")}
                  </button>
                  <button
                    onClick={() => setShowAlbumForm(!showAlbumForm)}
                    className="px-6 py-3 bg-gold text-white rounded-xl font-medium hover:bg-gold/90 transition-colors flex items-center gap-2"
                  >
                    <FolderPlus className="w-5 h-5" />
                    {showAlbumForm ? t("common.cancel") : t("admin.photography.panel.buttons.createAlbum")}
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* Tabs */}
          <div className="flex gap-2 mt-4 border-b border-sage/10">
            <button
              onClick={() => setActiveTab("photos")}
              className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                activeTab === "photos"
                  ? "border-gold text-charcoal"
                  : "border-transparent text-charcoal/60 hover:text-charcoal"
              }`}
            >
              {t("admin.photography.panel.tabs.photos")}
            </button>
            <button
              onClick={() => setActiveTab("albums")}
              className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                activeTab === "albums"
                  ? "border-gold text-charcoal"
                  : "border-transparent text-charcoal/60 hover:text-charcoal"
              }`}
            >
              {t("admin.photography.panel.tabs.albums")}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Import Modal */}
        {showImportModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full border border-sage/10 shadow-xl"
            >
              <h2 className="text-2xl font-heading font-bold text-charcoal mb-4">
                {importType === "instagram" 
                  ? t("admin.photography.panel.modal.importInstagram.title")
                  : importType === "urls"
                  ? t("admin.photography.panel.modal.importUrls.title")
                  : t("admin.photography.panel.modal.importImages.title")}
              </h2>
              
              {importType === "instagram" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    {t("admin.photography.panel.modal.importInstagram.instagramUrl")}
                  </label>
                  <input
                    type="text"
                    value={importInput}
                    onChange={(e) => setImportInput(e.target.value)}
                    placeholder="https://www.instagram.com/username"
                    className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                  />
                </div>
              )}

              {importType === "urls" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    {t("admin.photography.panel.modal.importUrls.urlsLabel")}
                  </label>
                  <textarea
                    value={importInput}
                    onChange={(e) => setImportInput(e.target.value)}
                    placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                  />
                </div>
              )}

              {importType === "files" && (
                <div className="mb-4">
                  <p className="text-sm text-charcoal/70">
                    {t("admin.photography.panel.modal.importImages.filesSelected").replace("{count}", String((window as any).__pendingImportFiles?.length || 0))}
                  </p>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-charcoal mb-2">
                  {t("admin.photography.panel.forms.albumTitle")} *
                </label>
                <input
                  type="text"
                  value={importAlbumTitle}
                  onChange={(e) => setImportAlbumTitle(e.target.value)}
                  placeholder={t("admin.photography.panel.forms.albumTitle")}
                  className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleImportSubmit}
                  className="flex-1 px-6 py-3 bg-gold text-white rounded-xl font-medium hover:bg-gold/90 transition-colors"
                >
                  {t("admin.photography.panel.modal.importInstagram.import")}
                </button>
                <button
                  onClick={() => {
                    setShowImportModal(false);
                    setImportInput("");
                    setImportAlbumTitle("");
                    (window as any).__pendingImportFiles = null;
                  }}
                  className="px-6 py-3 border border-sage/20 text-charcoal rounded-xl font-medium hover:bg-sage/10 transition-colors"
                >
                  {t("common.cancel")}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Gallery View */}
        {showGallery && (
          <div className="fixed inset-0 z-50">
            <PhotographyGallery
              photos={photos}
              onClose={() => setShowGallery(false)}
            />
          </div>
        )}

        {/* Album Form */}
        {activeTab === "albums" && showAlbumForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 border border-sage/10 shadow-sm mb-8"
          >
            <h2 className="text-2xl font-heading font-bold text-charcoal mb-6">
              {t("admin.photography.panel.forms.createNewAlbum")}
            </h2>
            <form onSubmit={handleAlbumSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  {t("admin.photography.panel.forms.albumTitle")} *
                </label>
                <input
                  type="text"
                  value={albumFormData.title}
                  onChange={(e) => setAlbumFormData({ ...albumFormData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  {t("admin.photography.panel.forms.albumDescription")}
                </label>
                <textarea
                  value={albumFormData.description}
                  onChange={(e) => setAlbumFormData({ ...albumFormData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  {t("admin.photography.panel.forms.coverImageUrl")}
                </label>
                <input
                  type="text"
                  value={albumFormData.coverImage}
                  onChange={(e) => setAlbumFormData({ ...albumFormData, coverImage: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                  placeholder="/photography/cover.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  {t("admin.photography.panel.forms.order")}
                </label>
                <input
                  type="number"
                  value={albumFormData.order}
                  onChange={(e) => setAlbumFormData({ ...albumFormData, order: parseInt(e.target.value) || 0 })}
                  className="w-24 px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                />
              </div>
              
              {/* Photo Selection */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  {t("admin.photography.panel.forms.selectPhotosCount").replace("{count}", String(selectedPhotos.length))}
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto p-4 border border-sage/20 rounded-xl">
                  {photos.map((photo) => {
                    const isSelected = selectedPhotos.includes(photo.id);
                    return (
                      <div
                        key={photo.id}
                        onClick={() => togglePhotoSelection(photo.id)}
                        className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                          isSelected
                            ? "border-gold ring-2 ring-gold/50"
                            : "border-sage/20 hover:border-sage/40"
                        }`}
                      >
                        <Image
                          src={photo.image}
                          alt={photo.title}
                          fill
                          className="object-cover"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-gold/20 flex items-center justify-center">
                            <div className="bg-gold text-white rounded-full p-2">
                              <Plus className="w-4 h-4" />
                            </div>
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 truncate">
                          {photo.title}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-gold text-white rounded-xl font-medium hover:bg-gold/90 transition-colors"
                >
                  {t("admin.photography.panel.forms.createAlbumWithPhotos").replace("{count}", String(selectedPhotos.length))}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAlbumForm(false);
                    setAlbumFormData({ title: "", description: "", coverImage: "", order: 0 });
                    setSelectedPhotos([]);
                  }}
                  className="px-6 py-3 border border-sage/20 text-charcoal rounded-xl font-medium hover:bg-sage/10 transition-colors"
                >
                  {t("common.cancel")}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Photo Form */}
        {activeTab === "photos" && showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 border border-sage/10 shadow-sm mb-8"
          >
            <h2 className="text-2xl font-heading font-bold text-charcoal mb-6">
              {t("admin.photography.panel.buttons.addPhoto")}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  {t("admin.photography.panel.forms.photoTitle")}
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  {t("admin.photography.panel.forms.category")}
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                  required
                >
                  <option value="">{t("admin.photography.panel.forms.category")}</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Portrait">Portrait</option>
                  <option value="Landscape">Landscape</option>
                  <option value="Event">Event</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  {t("admin.photography.panel.forms.imageUrl")}
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                  placeholder="/photography/image.jpg"
                  required
                />
                {formData.image && (
                  <div className="mt-4 relative w-full h-48 rounded-xl overflow-hidden border border-sage/20">
                    <Image
                      src={formData.image}
                      alt={formData.title || "Preview"}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  {t("admin.photography.panel.forms.photoDescription")}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                  rows={3}
                />
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-5 h-5 rounded border-sage/20 text-sage focus:ring-sage"
                  />
                  <span className="text-sm font-medium text-charcoal">{t("admin.photography.panel.forms.featured")}</span>
                </label>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    {t("admin.photography.panel.forms.order")}
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-24 px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-gold text-white rounded-xl font-medium hover:bg-gold/90 transition-colors"
                >
                  {t("common.save")}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-sage/20 text-charcoal rounded-xl font-medium hover:bg-sage/10 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Albums List */}
        {activeTab === "albums" && (
          <div className="bg-white rounded-2xl p-8 border border-sage/10 shadow-sm">
            <h2 className="text-2xl font-heading font-bold text-charcoal mb-6">
              {t("admin.photography.panel.messages.albumsCount").replace("{count}", String(albums.length))}
            </h2>
            {albums.length === 0 ? (
              <div className="text-center py-12 text-charcoal/60">
                {t("admin.photography.panel.messages.noAlbums")}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {albums.map((album) => (
                  <motion.div
                    key={album.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="border border-sage/10 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative w-full h-48 bg-gray-100">
                      {album.coverImage ? (
                        <Image
                          src={album.coverImage}
                          alt={album.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Folder className="w-16 h-16 text-charcoal/20" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-gold text-white px-2 py-1 rounded-lg text-xs font-medium">
                        {t("admin.photography.panel.messages.photosInAlbumCount").replace("{count}", String((album.photos || []).length))}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-charcoal mb-1">{album.title}</h3>
                      {album.description && (
                        <p className="text-sm text-charcoal/70 mb-4 line-clamp-2">
                          {album.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-charcoal/50">
                          {t("admin.photography.panel.messages.photosInAlbum").replace("{count}", String((album.photos || []).length))}
                        </span>
                        <div className="flex gap-2">
                          <Link
                            href={`/albums/${album.id}`}
                            target="_blank"
                            className="p-2 text-sage hover:bg-sage/10 rounded-lg transition-colors"
                            title="View Album"
                          >
                            <ImageIcon className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/photography-panel/albums/${album.id}`}
                            className="p-2 text-amber hover:bg-amber/10 rounded-lg transition-colors"
                            title="Edit Album"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteAlbum(album.id)}
                            className="p-2 text-coral hover:bg-coral/10 rounded-lg transition-colors"
                            title="Delete Album"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Photos Grid */}
        {activeTab === "photos" && (
          <div className="bg-white rounded-2xl p-8 border border-sage/10 shadow-sm">
            <h2 className="text-2xl font-heading font-bold text-charcoal mb-6">
              {t("admin.photography.panel.messages.photosCount").replace("{count}", String(photos.length))}
            </h2>
          {photos.length === 0 ? (
            <div className="text-center py-12 text-charcoal/60">
              {t("admin.photography.panel.messages.noPhotos")}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {photos.map((photo) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="border border-sage/10 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative w-full h-48 bg-gray-100">
                    <Image
                      src={photo.image}
                      alt={photo.title}
                      fill
                      className="object-cover"
                    />
                    {photo.featured && (
                      <div className="absolute top-2 right-2 bg-gold text-white px-2 py-1 rounded-lg text-xs font-medium">
                        Featured
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-charcoal mb-1">{photo.title}</h3>
                    <p className="text-sm text-charcoal/60 mb-2">{photo.category}</p>
                    {photo.description && (
                      <p className="text-sm text-charcoal/70 mb-4 line-clamp-2">
                        {photo.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-charcoal/50">{t("admin.photography.panel.messages.order").replace("{order}", String(photo.order))}</span>
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/photography-panel/${photo.id}`}
                          className="p-2 text-amber hover:bg-amber/10 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(photo.id)}
                          className="p-2 text-coral hover:bg-coral/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          </div>
        )}
      </div>
    </div>
  );
}




