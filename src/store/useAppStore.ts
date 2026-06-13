import { create } from "zustand";
import { AppState } from "@/types";
import { categories, getNextCategory, getPrevCategory } from "@/data/categories";

interface AppStore extends AppState {
  setActiveSheet: (sheet: string) => void;
  toggleCamouflageMode: () => void;
  setShowDetail: (show: boolean) => void;
  setSelectedNewsId: (id: number | null) => void;
  setSelectedCell: (cell: { row: number; col: string } | null) => void;
  setFormulaBarValue: (value: string) => void;
  nextSheet: () => void;
  prevSheet: () => void;
  goToSheetIndex: (index: number) => void;
  openNewsDetail: (newsId: number) => void;
  closeNewsDetail: () => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  activeSheet: "tech",
  isCamouflageMode: false,
  showDetail: false,
  selectedNewsId: null,
  selectedCell: { row: 1, col: "A" },
  formulaBarValue: "",

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
  setSelectedCell: (cell) => set({ selectedCell: cell }),
  setFormulaBarValue: (value) => set({ formulaBarValue: value }),

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
