
export interface SuccessStory {
  id: string;
  title: string;
  story_text: string;
  photo_url: string | null;
  cat_id: string | null;
  adoption_date: string | null;
  created_at: string;
  updated_at: string;
  show_on_homepage: boolean;
  cats?: { name: string };
}
