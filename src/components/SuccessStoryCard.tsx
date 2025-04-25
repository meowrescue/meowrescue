
import React, { useState } from "react";
import { Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import SuccessStoryPhoto from "./SuccessStoryPhoto";
import SuccessStoryQuote from "./SuccessStoryQuote";

type SuccessStoryCardProps = {
  photo_url?: string;
  cat_name?: string;
  adoption_date?: string | null;
  story_text: string;
};

function formatAdoptionDate(date?: string | null) {
  if (!date) return null;
  const d = new Date(date);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

// Constants for visual match to kitten formula card
const CARD_HEIGHT = "h-[265px]";
const IMAGE_SIZE = "w-16 h-16";
const TOP_SPACING = "pt-6";
const BOTTOM_SPACING = "pb-7";
const SIDE_PADDING = "px-6";

const SuccessStoryCard: React.FC<SuccessStoryCardProps> = ({
  photo_url,
  cat_name,
  adoption_date,
  story_text,
}) => {
  const [showFullStory, setShowFullStory] = useState(false);

  // The card is always clickable to open details (not the photo)
  const handleCardClick = () => setShowFullStory(true);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") setShowFullStory(true);
  };

  return (
    <>
      <div
        className={`
          bg-white rounded-xl shadow-lg border border-gray-50 transition-all hover:shadow-xl
          flex flex-col items-center relative ${CARD_HEIGHT} group
          cursor-pointer hover:ring-2 hover:ring-meow-primary/30
          focus:outline-none
        `}
        style={{
          minHeight: "265px",
          maxHeight: "265px",
          width: "100%",
          outline: "none",
          userSelect: "none",
        }}
        tabIndex={0}
        role="button"
        aria-label="Read the full success story"
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        onFocus={e => {
          e.currentTarget.style.outline = "none";
          e.currentTarget.style.boxShadow = "none";
        }}
        onBlur={e => {
          e.currentTarget.style.outline = "none";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {/* Photo at the very top, centered */}
        <div className={`flex flex-col items-center w-full ${TOP_SPACING}`}>
          <SuccessStoryPhoto
            photo_url={photo_url}
            cat_name={cat_name}
            imageSizeClass={IMAGE_SIZE}
            // The photo inside the card handles its own modal
          />
        </div>

        {/* Main content, centered vertically, consistent side padding and spacing */}
        <div className={`flex flex-col items-center flex-1 justify-center w-full ${SIDE_PADDING}`}>
          {/* Cat Name */}
          {cat_name && (
            <div className="text-meow-primary text-lg font-bold mt-4 mb-1 text-center">
              {cat_name}
            </div>
          )}
          {/* Adoption Date */}
          {adoption_date && (
            <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
              <Calendar className="h-4 w-4" />
              <span>{formatAdoptionDate(adoption_date)}</span>
            </div>
          )}
          {/* Stylized quotes: NO border, NO outline, NO box-shadow */}
          <div className="relative w-full flex-1 flex flex-col justify-center mt-1.5">
            <SuccessStoryQuote story_text={story_text} />
          </div>
        </div>
        {/* Equal bottom padding */}
        <div className={BOTTOM_SPACING} />
      </div>

      {/* Modal for full story */}
      {showFullStory && (
        <div
          className="fixed z-50 inset-0 bg-black/40 flex items-center justify-center"
          aria-modal="true"
          role="dialog"
          onClick={() => setShowFullStory(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-lg w-[90vw] px-7 py-10 relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 p-2 text-gray-400 hover:text-meow-primary"
              onClick={() => setShowFullStory(false)}
              aria-label="Close"
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
            {/* Modal Content */}
            <div className="flex flex-col items-center">
              <SuccessStoryPhoto
                photo_url={photo_url}
                cat_name={cat_name}
                imageSizeClass={IMAGE_SIZE}
                className="mb-5"
              />
              {cat_name && (
                <div className="text-meow-primary text-lg font-bold mb-1 text-center">
                  {cat_name}
                </div>
              )}
              {adoption_date && (
                <div className="flex items-center gap-1 text-gray-500 text-sm mb-4">
                  <Calendar className="h-4 w-4" />
                  <span>{formatAdoptionDate(adoption_date)}</span>
                </div>
              )}
              <SuccessStoryQuote story_text={story_text} size="base" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SuccessStoryCard;
