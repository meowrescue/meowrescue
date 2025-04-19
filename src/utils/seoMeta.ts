/**
 * Centralised SEO metadata for public routes.
 * Dynamic pages (e.g. blog posts) should still set their own
 * <SEO/> tags to override these defaults.
 */
export interface MetaEntry {
  title: string;
  description: string;
  keywords?: string;
}

export const seoMeta: Record<string, MetaEntry> = {
  "/": {
    title: "Meow Rescue | Saving Cats and Kittens in Florida",
    description:
      "Meow Rescue is a 501(c)(3) nonprofit dedicated to rescuing, rehabilitating, and re‑homing cats and kittens throughout Florida.",
    keywords:
      "cat rescue, cat adoption, kitten rescue, animal shelter, nonprofit, Florida"
  },
  "/about": {
    title: "About Meow Rescue",
    description:
      "Learn about Meow Rescue’s mission, team, and the values that drive our cat‑saving work.",
    keywords: "about Meow Rescue, animal rescue mission, cat welfare"
  },
  "/cats": {
    title: "Adoptable Cats | Meow Rescue",
    description:
      "Browse the lovable cats and kittens currently available for adoption from Meow Rescue.",
    keywords: "adoptable cats, cat adoption Florida, kittens for adoption"
  },
  "/adopt": {
    title: "How to Adopt | Meow Rescue",
    description:
      "Everything you need to know about adopting a cat from Meow Rescue, including requirements and fees.",
    keywords: "cat adoption process, adopt a cat, rescue adoption guidelines"
  },
  "/blog": {
    title: "Meow Rescue Blog",
    description:
      "Tips, success stories, and rescue news from the Meow Rescue team.",
    keywords: "cat care tips, success stories, rescue blog, Meow Rescue news"
  },
  "/events": {
    title: "Events & Fundraisers | Meow Rescue",
    description:
      "Join Meow Rescue events, adoption fairs, and fundraisers happening near you.",
    keywords: "cat adoption events, fundraisers, Meow Rescue calendar"
  },
  "/resources": {
    title: "Cat Care Resources | Meow Rescue",
    description:
      "Guides and resources for cat owners, fosters, and adopters.",
    keywords: "cat care resources, cat health, feline guides"
  },
  "/contact": {
    title: "Contact Meow Rescue",
    description:
      "Get in touch with Meow Rescue by email or social media, or visit us in New Port Richey, FL.",
    keywords: "contact Meow Rescue, email Meow Rescue, cat rescue contact"
  },
  "/donate": {
    title: "Donate to Meow Rescue",
    description:
      "Support Meow Rescue’s lifesaving work for cats and kittens with a tax‑deductible donation.",
    keywords: "donate to cat rescue, charity donation, support Meow Rescue"
  },
  "/volunteer": {
    title: "Volunteer with Meow Rescue",
    description:
      "Find out how you can volunteer or foster with Meow Rescue and make a difference for cats in need.",
    keywords:
      "volunteer cat rescue, foster cats, Meow Rescue volunteer opportunities"
  },
  "/foster": {
    title: "Foster a Cat | Meow Rescue",
    description:
      "Open your home to a cat or kitten in need—learn about Meow Rescue’s foster program.",
    keywords: "cat fostering, foster a kitten, foster program Florida"
  },
  "/privacy-policy": {
    title: "Privacy Policy | Meow Rescue",
    description:
      "Read Meow Rescue’s privacy policy regarding data collection and usage."
  },
  "/terms-of-service": {
    title: "Terms of Service | Meow Rescue",
    description:
      "Review the terms and conditions for using the Meow Rescue website."
  },
  "/lost-found": {
    title: "Lost & Found Cats | Meow Rescue",
    description:
      "Search or post lost and found cats in the community through Meow Rescue’s network.",
    keywords: "lost cat, found cat, cat finder"
  },
  "/success-stories": {
    title: "Success Stories | Meow Rescue",
    description:
      "Heartwarming adoption success stories from Meow Rescue’s alumni.",
    keywords: "cat adoption success, rescue success stories"
  }
};
