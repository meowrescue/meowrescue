
import React, { useState } from "react";
import { X } from "lucide-react";

interface SuccessStoryPhotoProps {
  photo_url?: string;
  cat_name?: string;
  imageSizeClass?: string;
  className?: string;
}

// Handles showing the photo and modal for "full-size" view.
const SuccessStoryPhoto: React.FC<SuccessStoryPhotoProps> = ({
  photo_url,
  cat_name,
  imageSizeClass = "w-16 h-16",
  className = "",
}) => {
  const [showImageModal, setShowImageModal] = useState(false);

  return (
    <>
      <div
        className={`
          ${imageSizeClass} rounded-full overflow-hidden border-2 border-meow-primary shadow
          flex items-center justify-center bg-gray-100 mx-auto
          cursor-zoom-in transition-colors duration-150
          ${className}
        `}
        style={{ minWidth: 64, minHeight: 64, maxWidth: 64, maxHeight: 64, border: "none", boxShadow: "none" }} // Remove border/shadow if present
        tabIndex={0}
        aria-label="Show full size photo"
        role="button"
        onClick={photo_url ? () => setShowImageModal(true) : undefined}
        onKeyDown={e => {
          if ((e.key === "Enter" || e.key === " ") && photo_url) setShowImageModal(true)
        }}
      >
        {photo_url ? (
          <img
            src={photo_url}
            alt={cat_name ?? "Adopted Cat"}
            className="object-cover w-full h-full"
            width={64}
            height={64}
            loading="lazy"
            draggable={false}
            style={{ border: "none", boxShadow: "none" }}
          />
        ) : (
          <div className="bg-gray-200 flex items-center justify-center w-full h-full text-3xl text-meow-primary font-bold">
            🐱
          </div>
        )}
      </div>
      {showImageModal && photo_url && (
        <div
          className="fixed z-[100] inset-0 bg-black/70 flex items-center justify-center"
          aria-modal="true"
          role="dialog"
          onClick={() => setShowImageModal(false)}
        >
          <div
            className="relative flex items-center justify-center max-w-full max-h-full"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 p-2 text-gray-300 hover:text-meow-primary z-10"
              onClick={() => setShowImageModal(false)}
              aria-label="Close full size photo"
              type="button"
              style={{
                background: "rgba(255,255,255,0.7)",
                borderRadius: 8,
              }}
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={photo_url}
              alt={cat_name ?? "Adopted Cat"}
              className="object-contain rounded-xl shadow-2xl bg-white max-h-[90vh] max-w-[90vw]"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default SuccessStoryPhoto;
