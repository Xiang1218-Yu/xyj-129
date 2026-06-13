import { create } from "zustand";
import { AppState } from "@/types";
import { categories, getNextCategory, getPrevCategory } from "@/data/categories";
import { newsData } from "@/data/newsData";

interface AppStore extends AppState {
  setActiveSheet: (sheet: string) => void;
  toggleCamouflageMode: () => void;
  setShowDetail: (show: boolean) => void;
  setSelectedNewsId: (id: number | null) => void;
  setSelectedCell: (cell: { row: number; col: string } | null) => void;
  setFormulaBarValue: (value: string) => void;
  setCellValue: (row: number, col: string, value: string) => void;
  getCellValue: (row: number, col: string) => string;
  toggleLikeNews: (newsId: number) => void;
  toggleCommentInput: (newsId: number) => void;
  addComment: (newsId: number) => void;
  nextSheet: () => void;
  prevSheet: () => void;
  goToSheetIndex: (index: number) => void;
  openNewsDetail: (newsId: number) => void;
  closeNewsDetail: () => void;
}

const initLikeCount: Record<number, number> = {};
const initCommentCount: Record<number, number> = {};
newsData.forEach((n) => {
  initLikeCount[n.id] = Math.floor(n.hot / 1000);
  initCommentCount[n.id] = Math.floor(n.hot / 5000);
});

export const useAppStore = create<AppStore>((set, get) => ({
  activeSheet: "tech",
  isCamouflageMode: false,
  showDetail: false,
  selectedNewsId: null,
  selectedCell: { row: 1, col: "A" },
  formulaBarValue: "",
  cellValues: {},
  likedNews: {},
  newsLikeCount: initLikeCount,
  newsCommentCount: initCommentCount,
  commentInputVisible: {},

  setActiveSheet: (sheet) => {
    set({ activeSheet: sheet, showDetail: false, selectedNewsId: null });
  },

  toggleCamouflageMode: () => {
    const next = !get().isCamouflageMode;
    set({
      isCamouflageMode: next,
      showDetail: false,
      selectedNewsId: null,
    });
    if (typeof document !== "undefined") {
      document.title = next
        ? "年度财务报表.xlsx - Excel"
        : "年度财务报表.xlsx - Excel";
    }
  },

  setShowDetail: (show) => set({ showDetail: show }),
  setSelectedNewsId: (id) => set({ selectedNewsId: id }),
  setSelectedCell: (cell) => {
    set({
      selectedCell: cell,
      formulaBarValue: cell ? get().getCellValue(cell.row, cell.col) : "",
    });
  },
  setFormulaBarValue: (value) => {
    const { selectedCell } = get();
    if (selectedCell) {
      set({ formulaBarValue: value });
      get().setCellValue(selectedCell.row, selectedCell.col, value);
    } else {
      set({ formulaBarValue: value });
    }
  },

  setCellValue: (row, col, value) => {
    const key = `${col}${row}`;
    set((state) => ({
      cellValues: { ...state.cellValues, [key]: value },
    }));
  },

  getCellValue: (row, col) => {
    const key = `${col}${row}`;
    return get().cellValues[key] || "";
  },

  toggleLikeNews: (newsId) => {
    set((state) => {
      const alreadyLiked = !!state.likedNews[newsId];
      const delta = alreadyLiked ? -1 : 1;
      return {
        likedNews: { ...state.likedNews, [newsId]: !alreadyLiked },
        newsLikeCount: {
          ...state.newsLikeCount,
          [newsId]: Math.max(0, (state.newsLikeCount[newsId] || 0) + delta),
        },
      };
    });
  },

  toggleCommentInput: (newsId) => {
    set((state) => ({
      commentInputVisible: {
        ...state.commentInputVisible,
        [newsId]: !state.commentInputVisible[newsId],
      },
    }));
  },

  addComment: (newsId) => {
    set((state) => ({
      newsCommentCount: {
        ...state.newsCommentCount,
        [newsId]: (state.newsCommentCount[newsId] || 0) + 1,
      },
      commentInputVisible: {
        ...state.commentInputVisible,
        [newsId]: false,
      },
    }));
  },

  nextSheet: () => {
    const current = get().activeSheet;
    const next = getNextCategory(current);
    set({
      activeSheet: next.id,
      showDetail: false,
      selectedNewsId: null,
    });
  },

  prevSheet: () => {
    const current = get().activeSheet;
    const prev = getPrevCategory(current);
    set({
      activeSheet: prev.id,
      showDetail: false,
      selectedNewsId: null,
    });
  },

  goToSheetIndex: (index) => {
    const safeIndex = Math.max(0, Math.min(index, categories.length - 1));
    set({
      activeSheet: categories[safeIndex].id,
      showDetail: false,
      selectedNewsId: null,
    });
  },

  openNewsDetail: (newsId) => {
    set({ selectedNewsId: newsId, showDetail: true });
  },

  closeNewsDetail: () => {
    set({ showDetail: false, selectedNewsId: null });
  },
}));
