export interface NewsItem {
  id: number;
  category: string;
  title: string;
  source: string;
  author: string;
  hot: number;
  publishTime: string;
  summary: string;
  content: string;
}

export interface Category {
  id: string;
  name: string;
  order: number;
}

export interface NewsReadStatus {
  read: boolean;
  readAt: number;
  progress: number;
}

export interface AppState extends NotesState {
  activeSheet: string;
  isCamouflageMode: boolean;
  showDetail: boolean;
  selectedNewsId: number | null;
  selectedCell: { row: number; col: string } | null;
  formulaBarValue: string;
  cellValues: Record<string, string>;
  likedNews: Record<number, boolean>;
  newsLikeCount: Record<number, number>;
  newsCommentCount: Record<number, number>;
  commentInputVisible: Record<number, boolean>;
  camouflageMode: CamouflageMode;
  activeWorkTemplateId: string;
  workTemplateCellValues: Record<string, Record<string, string>>;
  showTemplateSelector: boolean;
  newsReadStatus: Record<number, NewsReadStatus>;
}

export interface CamouflageRow {
  [key: string]: string | number;
  A: string;
  B: string | number;
  C: string | number;
  D: string | number;
  E: string | number;
  F: string | number;
  G: string | number;
  H: string | number;
}

export interface CamouflageTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  rows: CamouflageRow[];
  formulaRows?: { [key: string]: string }[];
  titleRow?: number;
  headerRow?: number;
  summaryRow?: number;
  highlightColumns?: string[];
  colCount?: number;
  totalRows?: number;
}

export type CamouflageMode = "finance" | "workTask";

export interface WorkTaskTemplate {
  id: string;
  name: string;
  rows: CamouflageRow[];
  formulaRows?: { [key: string]: string }[];
  colCount?: number;
  totalRows?: number;
}

export interface ShortcutItem {
  keys: string;
  description: string;
}

export interface HelpSection {
  title: string;
  items: ShortcutItem[];
}

export interface NoteTag {
  id: string;
  name: string;
  color: string;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export interface CellNote {
  content: string;
  tags: NoteTag[];
  todos: TodoItem[];
  createdAt: number;
  updatedAt: number;
}

export interface NotesState {
  notes: Record<string, CellNote>;
  showNotePanel: boolean;
  notePanelCell: { row: number; col: string } | null;
  allTags: NoteTag[];
}

export interface OfficePhrase {
  id: string;
  title: string;
  content: string;
  tags?: string[];
}

export interface OfficePhraseCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  phrases: OfficePhrase[];
}
