"use client";

import { useState, useRef } from "react";
import { X, Image as ImageIcon, Video, AlertCircle, Upload } from "lucide-react";
import Image from "next/image";

interface MediaUploadProps {
  images: string[];
  videos: string[];
  onImagesChange: (images: string[]) => void;
  onVideosChange: (videos: string[]) => void;
  maxImages?: number;
  maxVideos?: number;
  minImages?: number;
  label?: string;
}

export default function MediaUpload({
  images,
  videos,
  onImagesChange,
  onVideosChange,
  maxImages = 10,
  maxVideos = 2,
  minImages = 1,
  label = "Media",
}: MediaUploadProps) {
  const [imageError, setImageError] = useState<string>("");
  const [videoError, setVideoError] = useState<string>("");
  const [showImageInput, setShowImageInput] = useState(false);
  const [showVideoInput, setShowVideoInput] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [videoUrlInput, setVideoUrlInput] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const imageFileInputRef = useRef<HTMLInputElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUrlAdd = (e?: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>) => {
    e?.preventDefault();
    e?.stopPropagation();
    const url = imageUrlInput.trim();
    if (url) {
      if (images.length >= maxImages) {
        setImageError(`Maximum ${maxImages} images allowed`);
        setTimeout(() => setImageError(""), 3000);
        return;
      }
      onImagesChange([...images, url]);
      setImageUrlInput("");
      setShowImageInput(false);
      setImageError("");
    }
  };

  const handleVideoUrlAdd = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (videoUrlInput.trim()) {
      if (videos.length >= maxVideos) {
        setVideoError(`Maximum ${maxVideos} videos allowed`);
        setTimeout(() => setVideoError(""), 3000);
        return;
      }
      onVideosChange([...videos, videoUrlInput.trim()]);
      setVideoUrlInput("");
      setShowVideoInput(false);
      setVideoError("");
    }
  };

  const handleImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      setImageError(`Maximum ${maxImages} images allowed. You can only add ${maxImages - images.length} more.`);
      setTimeout(() => setImageError(""), 3000);
      e.target.value = "";
      return;
    }

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        setImageError(`${file.name} is not a valid image file`);
        setTimeout(() => setImageError(""), 3000);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onImagesChange([...images, event.target.result as string]);
        }
      };
      reader.onerror = () => {
        setImageError(`Failed to read ${file.name}`);
        setTimeout(() => setImageError(""), 3000);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const handleVideoFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (videos.length + files.length > maxVideos) {
      setVideoError(`Maximum ${maxVideos} videos allowed. You can only add ${maxVideos - videos.length} more.`);
      setTimeout(() => setVideoError(""), 3000);
      e.target.value = "";
      return;
    }

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("video/")) {
        setVideoError(`${file.name} is not a valid video file`);
        setTimeout(() => setVideoError(""), 3000);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onVideosChange([...videos, event.target.result as string]);
        }
      };
      reader.onerror = () => {
        setVideoError(`Failed to read ${file.name}`);
        setTimeout(() => setVideoError(""), 3000);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const cancelImageInput = () => {
    setImageUrlInput("");
    setShowImageInput(false);
  };

  const cancelVideoInput = () => {
    setVideoUrlInput("");
    setShowVideoInput(false);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
    setImageError("");
  };

  const removeVideo = (index: number) => {
    const newVideos = videos.filter((_, i) => i !== index);
    onVideosChange(newVideos);
    setVideoError("");
  };

  const hasMinImages = images.length >= minImages;
  const hasMaxImages = images.length >= maxImages;
  const hasMaxVideos = videos.length >= maxVideos;

  return (
    <div className="space-y-6">
      {/* Images Section */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">
          Images {minImages > 0 && <span className="text-coral">*</span>}
          <span className="text-charcoal/60 text-xs font-normal ml-2">
            ({images.length}/{maxImages} - Minimum {minImages} required)
          </span>
        </label>
        
        {!hasMinImages && (
          <div className="mb-2 p-2 bg-amber/10 border border-amber/20 rounded-lg text-amber text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            At least {minImages} image{minImages > 1 ? "s" : ""} required
          </div>
        )}

        {imageError && (
          <div className="mb-2 p-2 bg-coral/10 border border-coral/20 rounded-lg text-coral text-sm">
            {imageError}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-2">
          {images.map((img, index) => (
            <div key={index} className="relative group">
              <div className="relative w-24 h-24 rounded-lg border-2 border-sage/20 overflow-hidden bg-sage/5">
                <Image
                  src={img}
                  alt={`Image ${index + 1}`}
                  fill
                  className="object-cover"
                  onError={() => {
                    setImageError(`Invalid image URL at position ${index + 1}`);
                    setTimeout(() => setImageError(""), 3000);
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-coral text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-coral/80"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-1 py-0.5 text-center">
                {index + 1}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap">
          {!showImageInput ? (
            <>
              <input
                ref={imageFileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageFileSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => {
                  if (imageFileInputRef.current) {
                    imageFileInputRef.current.click();
                  }
                }}
                disabled={hasMaxImages}
                className={`px-4 py-2 bg-sage text-white rounded-lg text-sm hover:bg-sage/90 transition-colors flex items-center gap-2 ${
                  hasMaxImages ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Upload className="w-4 h-4" />
                Upload from Local
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowImageInput(true);
                  setTimeout(() => {
                    if (imageInputRef.current) {
                      imageInputRef.current.focus();
                    }
                  }, 100);
                }}
                disabled={hasMaxImages}
                className={`px-4 py-2 border border-sage/20 rounded-lg text-sm text-charcoal/70 hover:bg-sage/10 transition-colors flex items-center gap-2 ${
                  hasMaxImages ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                {hasMaxImages ? `Maximum ${maxImages} images reached` : `Add Image URL`}
              </button>
            </>
          ) : (
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <input
              ref={imageInputRef}
              type="url"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.stopPropagation();
                  const nativeEvent = e.nativeEvent as any;
                  if (nativeEvent.stopImmediatePropagation) {
                    nativeEvent.stopImmediatePropagation();
                  }
                  handleImageUrlAdd(e);
                } else if (e.key === "Escape") {
                  e.preventDefault();
                  e.stopPropagation();
                  cancelImageInput();
                }
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
              placeholder="Enter image URL"
              className="flex-1 px-4 py-2 border border-sage/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage"
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const nativeEvent = e.nativeEvent as any;
                if (nativeEvent.stopImmediatePropagation) {
                  nativeEvent.stopImmediatePropagation();
                }
                handleImageUrlAdd(e);
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="px-4 py-2 bg-sage text-white rounded-lg text-sm hover:bg-sage/90 transition-colors"
            >
              Add
            </button>
            <button
              type="button"
              onClick={cancelImageInput}
              className="px-4 py-2 border border-sage/20 rounded-lg text-sm text-charcoal/70 hover:bg-sage/10 transition-colors"
            >
              Cancel
            </button>
          </div>
          )}
        </div>
      </div>

      {/* Videos Section */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">
          Videos
          <span className="text-charcoal/60 text-xs font-normal ml-2">
            ({videos.length}/{maxVideos})
          </span>
        </label>

        {videoError && (
          <div className="mb-2 p-2 bg-coral/10 border border-coral/20 rounded-lg text-coral text-sm">
            {videoError}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-2">
          {videos.map((video, index) => (
            <div key={index} className="relative group">
              <div className="relative w-24 h-24 rounded-lg border-2 border-sage/20 overflow-hidden bg-sage/5 flex items-center justify-center">
                <Video className="w-8 h-8 text-sage/60" />
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-1 py-0.5 text-center truncate">
                  Video {index + 1}
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeVideo(index)}
                className="absolute -top-2 -right-2 bg-coral text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-coral/80"
                title="Remove video"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap">
          {!showVideoInput ? (
            <>
              <input
                ref={videoFileInputRef}
                type="file"
                accept="video/*"
                multiple
                onChange={handleVideoFileSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => {
                  if (videoFileInputRef.current) {
                    videoFileInputRef.current.click();
                  }
                }}
                disabled={hasMaxVideos}
                className={`px-4 py-2 bg-sage text-white rounded-lg text-sm hover:bg-sage/90 transition-colors flex items-center gap-2 ${
                  hasMaxVideos ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Upload className="w-4 h-4" />
                Upload from Local
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowVideoInput(true);
                  setTimeout(() => {
                    if (videoInputRef.current) {
                      videoInputRef.current.focus();
                    }
                  }, 100);
                }}
                disabled={hasMaxVideos}
                className={`px-4 py-2 border border-sage/20 rounded-lg text-sm text-charcoal/70 hover:bg-sage/10 transition-colors flex items-center gap-2 ${
                  hasMaxVideos ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Video className="w-4 h-4" />
                {hasMaxVideos ? `Maximum ${maxVideos} videos reached` : `Add Video URL`}
              </button>
            </>
          ) : (
          <div className="flex gap-2">
            <input
              ref={videoInputRef}
              type="url"
              value={videoUrlInput}
              onChange={(e) => setVideoUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.stopPropagation();
                  handleVideoUrlAdd();
                } else if (e.key === "Escape") {
                  e.preventDefault();
                  e.stopPropagation();
                  cancelVideoInput();
                }
              }}
              placeholder="Enter video URL"
              className="flex-1 px-4 py-2 border border-sage/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage"
            />
            <button
              type="button"
              onClick={(e) => handleVideoUrlAdd(e)}
              className="px-4 py-2 bg-sage text-white rounded-lg text-sm hover:bg-sage/90 transition-colors"
            >
              Add
            </button>
            <button
              type="button"
              onClick={cancelVideoInput}
              className="px-4 py-2 border border-sage/20 rounded-lg text-sm text-charcoal/70 hover:bg-sage/10 transition-colors"
            >
              Cancel
            </button>
          </div>
          )}
        </div>

        {videos.length > 0 && (
          <div className="mt-2 space-y-1">
            {videos.map((video, index) => (
              <div key={index} className="text-xs text-charcoal/60 truncate">
                Video {index + 1}: {video}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

