export interface Subtopic {
  id: string;
  slug: string;
  title: string;
  durationMinutes?: number;
  content: string; // Markdown or rich text
  video?: {
    title: string;
    youtubeId: string;
    duration: string;
    author: string;
  };
}

export interface Unit {
  id: string;
  slug: string;
  code: string; // e.g., "SMA 2100", "ICS 2101"
  title: string;
  colorVariant: "butter" | "lilac" | "ice" | "charcoal";
  subtopics: Subtopic[];
}

export interface YearHub {
  yearNumber: number; // 1, 2, 3, 4
  slug: string;
  title: string;
  description: string;
  coverImage: string;
  units: Unit[];
}
