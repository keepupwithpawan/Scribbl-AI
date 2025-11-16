
export type Theme = 'light' | 'dark';
export type NoteType = 'digital' | 'physical' | null;

export interface DigitalNoteContent {
  type: "bullet" | "paragraph" | "image_idea" | "generated_image";
  point?: string;
  text?: string;
  description?: string;
  imageUrl?: string;
}

export interface DigitalNoteTopic {
  topicTitle: string;
  content: DigitalNoteContent[];
}

export interface ChartAndGraph {
  title: string;
  type: 'flowchart' | 'bar_chart';
  data: any; // Data will be structured based on type, e.g., string[] for flowchart
  description: string;
}

export interface PracticeQuestion {
  question: string;
  type: string;
}

export interface DigitalNotesData {
  title: string;
  summary: string;
  keyTopics: DigitalNoteTopic[];
  chartsAndGraphs: ChartAndGraph[];
  practiceQuestions: PracticeQuestion[];
}

export interface DiagramIdea {
    title: string;
    description: string;
}

export interface PhysicalNoteSection {
    heading: string;
    points: string[];
    diagramIdea?: DiagramIdea;
}

export interface PhysicalNotesData {
    title: string;
    mainSummary: string;
    sections: PhysicalNoteSection[];
}