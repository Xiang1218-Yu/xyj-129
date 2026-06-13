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

export interface AppState {
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

export interface ShortcutItem {
  keys: string;
  description: string;
}

export interface HelpSection {
  title: string;
  items: ShortcutItem[];
}
