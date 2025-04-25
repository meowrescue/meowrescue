
import React from "react";

interface SuccessStoryQuoteProps {
  story_text: string;
  className?: string;
  size?: "sm" | "base";
}

const SuccessStoryQuote: React.FC<SuccessStoryQuoteProps> = ({
  story_text,
  className = "",
  size = "sm"
}) => {
  // Prevent border, box-shadow, or background! No outline at all!
  return (
    <div
      className={`
        text-center text-meow-dark
        leading-relaxed font-medium
        font-playfair
        px-6 py-4 rounded-lg
        ${size === "sm" ? "text-sm min-h-[72px]" : "text-base"}
        flex items-center justify-center
        m-0
        ${className}
      `}
      style={{
        border: "none",
        background: "none",
        boxShadow: "none",
        outline: "none"
      }}
    >
      <span className="text-4xl text-meow-primary font-serif leading-none align-top" aria-hidden="true">&ldquo;</span>
      <span className="inline px-1">{story_text}</span>
      <span className="text-4xl text-meow-primary font-serif leading-none align-bottom" aria-hidden="true">&rdquo;</span>
    </div>
  );
};
export default SuccessStoryQuote;
