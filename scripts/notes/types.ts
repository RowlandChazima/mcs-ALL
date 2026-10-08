export type Level = "error" | "warning";

export interface Issue {
  level: Level;
  file: string; // path relative to the notes folder, for display
  line?: number;
  message: string;
}

export type ResourceCategory = "past_paper" | "lecture_slide" | "tutorial_sheet";

export interface VideoMeta {
  id: string;
  title: string | null;
  author: string | null;
  duration: string | null;
}

export interface ImageRef {
  url: string; // exactly as typed in the markdown
  absPath: string;
  start: number; // offsets of the whole ![..](..) inside `body`
  end: number;
  line: number;
}

export interface ParsedNote {
  file: string;
  rel: string;
  slug: string;
  title: string;
  order: number;
  summary: string | null;
  video: VideoMeta | null;
  body: string;
  images: ImageRef[];
  readingMinutes: number;
}

export interface ResourceSpec {
  title: string;
  category: ResourceCategory;
  file: string; // as typed
  absPath: string;
}

export interface UnitFileMeta {
  code?: string;
  title?: string;
  year?: number;
  semester?: 1 | 2;
  category?: "pure_math" | "computer_science" | "applied_math";
  color?: "butter" | "lilac" | "ice" | "charcoal";
  description?: string;
  exam_tip?: string;
  order?: number;
  resources?: ResourceSpec[];
}

export interface ParsedUnit {
  slug: string;
  dir: string;
  meta: UnitFileMeta | null;
  notes: ParsedNote[];
}
