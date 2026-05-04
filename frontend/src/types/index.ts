export interface NeologismTag {
  id: string;
  label: string;
}

export interface NeologismContext {
  quote: string;
  speaker: string;
  source: string;
}

export interface Neologism {
  id: string;
  word: string;
  phonetic: string;
  grammaticalClass: string;
  definition: string;
  context: NeologismContext;
  tags: NeologismTag[];
  createdAt: string;
  likes: number;
  comments: number;
}

export interface FilterCategory {
  id: string;
  label: string;
}
