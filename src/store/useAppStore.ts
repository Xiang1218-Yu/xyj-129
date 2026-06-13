import { create } from "zustand";
import { AppState, CellNote, NoteTag, CamouflageMode } from "@/types";
import { categories, getNextCategory, getPrevCategory } from "@/data/categories";
import { newsData } from "@/data/newsData";
import { workTaskTemplates, getWorkTemplateById } from "@/data/camouflageData";
import {
  encodeNoteToFormula,
  decodeNoteFromFormula,
  getNoteCellKey,
  createEmptyNote,
  createTag,
  createTodo,
  PRESET_TAGS,
} from "@/lib/noteCodec";

interface AppStore extends AppState {
  setActiveSheet: (sheet: string) => void;
  toggleCamouflageMode: () => void;
  setCamouflageMode: (mode: CamouflageMode) => void;
  setActiveWorkTemplateId: (id: string) => void;
  setWorkTemplateCellValue: (templateId: string, row: number, col: string, value: string) => void;
  getWorkTemplateCellValue: (templateId: string, row: number, col: string) => string;
  toggleTemplateSelector: () => void;
  setShowTemplateSelector: (show: boolean) => void;
  saveWorkTemplate: () => void;
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
  toggleNotePanel: () => void;
  openNotePanel: (row: number, col: string) => void;
  closeNotePanel: () => void;
  getCellNote: (row: number, col: string) => CellNote | null;
  setCellNote: (row: number, col: string, note: CellNote) => void;
  updateNoteContent: (row: number, col: string, content: string) => void;
  addNoteTag: (row: number, col: string, tag: NoteTag) => void;
  removeNoteTag: (row: number, col: string, tagId: string) => void;
  addTodo: (row: number, col: string, text: string) => void;
  toggleTodo: (row: number, col: string, todoId: string) => void;
  removeTodo: (row: number, col: string, todoId: string) => void;
  addGlobalTag: (name: string, color: string) => void;
  removeGlobalTag: (tagId: string) => void;
  deleteCellNote: (row: number, col: string) => void;
  hasCellNote: (row: number, col: string) => boolean;
  getPendingTodosCount: (row: number, col: string) => number;
}

const initLikeCount: Record<number, number> = {};
const initCommentCount: Record<number, number> = {};
newsData.forEach((n) => {
  initLikeCount[n.id] = Math.floor(n.hot / 1000);
  initCommentCount[n.id] = Math.floor(n.hot / 5000);
});

export const useAppStore = create<AppStore>((set, get) => {
  let savedTemplateId = workTaskTemplates[0]?.id || "daily-task";
  let savedWorkCellValues: Record<string, Record<string, string>> = {};
  try {
    const tplId = localStorage.getItem("activeWorkTemplateId");
    if (tplId) savedTemplateId = tplId;
    const saved = localStorage.getItem("workTemplateCellValues");
    if (saved) savedWorkCellValues = JSON.parse(saved);
  } catch (e) {
    console.warn("读取缓存失败:", e);
  }

  return {
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
  notes: {},
  showNotePanel: false,
  notePanelCell: null,
  allTags: [...PRESET_TAGS],
  camouflageMode: "finance",
  activeWorkTemplateId: savedTemplateId,
  workTemplateCellValues: savedWorkCellValues,
  showTemplateSelector: false,

  setActiveSheet: (sheet) => {
    set({ activeSheet: sheet, showDetail: false, selectedNewsId: null });
  },

  toggleCamouflageMode: () => {
    const next = !get().isCamouflageMode;
    const mode = get().camouflageMode;
    const workTpl = getWorkTemplateById(get().activeWorkTemplateId);
    set({
      isCamouflageMode: next,
      showDetail: false,
      selectedNewsId: null,
    });
    if (typeof document !== "undefined") {
      const defaultTitle = "年度财务报表.xlsx - Excel";
      const workTitle = workTpl ? `${workTpl.name}.xlsx - Excel` : defaultTitle;
      document.title = next
        ? (mode === "workTask" ? workTitle : defaultTitle)
        : defaultTitle;
    }
  },

  setCamouflageMode: (mode) => {
    set({ camouflageMode: mode });
    const workTpl = getWorkTemplateById(get().activeWorkTemplateId);
    if (typeof document !== "undefined" && get().isCamouflageMode) {
      const defaultTitle = "年度财务报表.xlsx - Excel";
      const workTitle = workTpl ? `${workTpl.name}.xlsx - Excel` : defaultTitle;
      document.title = mode === "workTask" ? workTitle : defaultTitle;
    }
  },

  setActiveWorkTemplateId: (id) => {
    const tpl = getWorkTemplateById(id);
    set({ activeWorkTemplateId: id });
    if (typeof document !== "undefined" && get().isCamouflageMode && tpl) {
      document.title = `${tpl.name}.xlsx - Excel`;
    }
  },

  setWorkTemplateCellValue: (templateId, row, col, value) => {
    const key = `${col}${row}`;
    set((state) => {
      const tplValues = state.workTemplateCellValues[templateId] || {};
      return {
        workTemplateCellValues: {
          ...state.workTemplateCellValues,
          [templateId]: { ...tplValues, [key]: value },
        },
      };
    });
  },

  getWorkTemplateCellValue: (templateId, row, col) => {
    const key = `${col}${row}`;
    const tplValues = get().workTemplateCellValues[templateId] || {};
    return tplValues[key] || "";
  },

  toggleTemplateSelector: () => {
    set((state) => ({ showTemplateSelector: !state.showTemplateSelector }));
  },

  setShowTemplateSelector: (show) => {
    set({ showTemplateSelector: show });
  },

  saveWorkTemplate: () => {
    const { workTemplateCellValues, activeWorkTemplateId } = get();
    try {
      localStorage.setItem(
        "workTemplateCellValues",
        JSON.stringify(workTemplateCellValues)
      );
      localStorage.setItem("activeWorkTemplateId", activeWorkTemplateId);
    } catch (e) {
      console.warn("保存失败:", e);
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

  toggleNotePanel: () => {
    const { showNotePanel, selectedCell } = get();
    if (showNotePanel) {
      set({ showNotePanel: false, notePanelCell: null });
    } else if (selectedCell) {
      set({ showNotePanel: true, notePanelCell: { ...selectedCell } });
    }
  },

  openNotePanel: (row, col) => {
    set({ showNotePanel: true, notePanelCell: { row, col } });
  },

  closeNotePanel: () => {
    set({ showNotePanel: false, notePanelCell: null });
  },

  getCellNote: (row, col) => {
    const key = getNoteCellKey(row, col);
    const { notes, cellValues } = get();

    if (notes[key]) {
      return notes[key];
    }

    const cellValue = cellValues[key];
    if (cellValue) {
      const decoded = decodeNoteFromFormula(cellValue);
      if (decoded) {
        return decoded;
      }
    }

    return null;
  },

  setCellNote: (row, col, note) => {
    const key = getNoteCellKey(row, col);
    const formula = encodeNoteToFormula(note);

    set((state) => ({
      notes: { ...state.notes, [key]: note },
      cellValues: { ...state.cellValues, [key]: formula },
    }));

    const { selectedCell, notePanelCell } = get();
    if ((selectedCell && selectedCell.row === row && selectedCell.col === col) ||
        (notePanelCell && notePanelCell.row === row && notePanelCell.col === col)) {
      set({ formulaBarValue: formula });
    }
  },

  updateNoteContent: (row, col, content) => {
    const { getCellNote, setCellNote } = get();
    const existing = getCellNote(row, col);
    const note = existing || createEmptyNote();
    const updated: CellNote = {
      ...note,
      content,
      updatedAt: Date.now(),
    };
    setCellNote(row, col, updated);
  },

  addNoteTag: (row, col, tag) => {
    const { getCellNote, setCellNote } = get();
    const existing = getCellNote(row, col);
    const note = existing || createEmptyNote();
    if (note.tags.some((t) => t.id === tag.id)) return;
    const updated: CellNote = {
      ...note,
      tags: [...note.tags, tag],
      updatedAt: Date.now(),
    };
    setCellNote(row, col, updated);
  },

  removeNoteTag: (row, col, tagId) => {
    const { getCellNote, setCellNote } = get();
    const note = getCellNote(row, col);
    if (!note) return;
    const updated: CellNote = {
      ...note,
      tags: note.tags.filter((t) => t.id !== tagId),
      updatedAt: Date.now(),
    };
    setCellNote(row, col, updated);
  },

  addTodo: (row, col, text) => {
    const { getCellNote, setCellNote } = get();
    const existing = getCellNote(row, col);
    const note = existing || createEmptyNote();
    const newTodo = createTodo(text);
    const updated: CellNote = {
      ...note,
      todos: [...note.todos, newTodo],
      updatedAt: Date.now(),
    };
    setCellNote(row, col, updated);
  },

  toggleTodo: (row, col, todoId) => {
    const { getCellNote, setCellNote } = get();
    const note = getCellNote(row, col);
    if (!note) return;
    const updated: CellNote = {
      ...note,
      todos: note.todos.map((t) =>
        t.id === todoId ? { ...t, completed: !t.completed } : t
      ),
      updatedAt: Date.now(),
    };
    setCellNote(row, col, updated);
  },

  removeTodo: (row, col, todoId) => {
    const { getCellNote, setCellNote } = get();
    const note = getCellNote(row, col);
    if (!note) return;
    const updated: CellNote = {
      ...note,
      todos: note.todos.filter((t) => t.id !== todoId),
      updatedAt: Date.now(),
    };
    setCellNote(row, col, updated);
  },

  addGlobalTag: (name, color) => {
    const newTag = createTag(name, color);
    set((state) => ({
      allTags: [...state.allTags, newTag],
    }));
  },

  removeGlobalTag: (tagId) => {
    set((state) => ({
      allTags: state.allTags.filter((t) => t.id !== tagId),
    }));
  },

  deleteCellNote: (row, col) => {
    const key = getNoteCellKey(row, col);
    set((state) => {
      const newNotes = { ...state.notes };
      delete newNotes[key];
      const newCellValues = { ...state.cellValues };
      delete newCellValues[key];
      return { notes: newNotes, cellValues: newCellValues };
    });
  },

  hasCellNote: (row, col) => {
    const key = getNoteCellKey(row, col);
    const { notes, cellValues } = get();
    if (notes[key]) return true;
    const cv = cellValues[key];
    return !!(cv && decodeNoteFromFormula(cv));
  },

  getPendingTodosCount: (row, col) => {
    const note = get().getCellNote(row, col);
    if (!note) return 0;
    return note.todos.filter((t) => !t.completed).length;
  },
  };
});
