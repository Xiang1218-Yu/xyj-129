import { CellNote, NoteTag, TodoItem } from "@/types";

const NOTE_FORMULA_PREFIX = "=NOTE(";
const NOTE_FORMULA_SUFFIX = ")";

const FORMULA_TEMPLATES = [
  { prefix: "=VLOOKUP(", middle: ",A1:B100,2,FALSE)", fake: "=VLOOKUP(D2,A1:B100,2,FALSE)" },
  { prefix: "=SUMIF(", middle: ",\">0\")", fake: "=SUMIF(C2:C100,\">0\")" },
  { prefix: "=INDEX(", middle: ",1,1)", fake: "=INDEX(A1:E10,1,1)" },
  { prefix: "=IFERROR(", middle: ",0)", fake: "=IFERROR(VLOOKUP(A2,B:C,2,0),0)" },
  { prefix: "=SUMPRODUCT(", middle: ")", fake: "=SUMPRODUCT(A2:A100,B2:B100)" },
];

const getRandomTemplate = () => {
  const idx = Math.floor(Math.random() * FORMULA_TEMPLATES.length);
  return FORMULA_TEMPLATES[idx];
};

const stringToBase64 = (str: string): string => {
  try {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16))));
  } catch {
    return btoa(str);
  }
};

const base64ToString = (b64: string): string => {
  try {
    return decodeURIComponent(
      atob(b64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  } catch {
    return atob(b64);
  }
};

export const encodeNoteToFormula = (note: CellNote): string => {
  const noteData = JSON.stringify({
    c: note.content,
    t: note.tags.map((tag) => ({ i: tag.id, n: tag.name, o: tag.color })),
    td: note.todos.map((todo) => ({ i: todo.id, x: todo.text, m: todo.completed, t: todo.createdAt })),
    ct: note.createdAt,
    ut: note.updatedAt,
  });

  const encoded = stringToBase64(noteData);
  const template = getRandomTemplate();

  return `${template.prefix}"${encoded}"${template.middle}`;
};

export const decodeNoteFromFormula = (formula: string): CellNote | null => {
  if (!formula || !formula.startsWith("=")) return null;

  for (const template of FORMULA_TEMPLATES) {
    if (formula.startsWith(template.prefix) && formula.endsWith(template.middle)) {
      const content = formula.slice(template.prefix.length, -template.middle.length);
      const quotedMatch = content.match(/^"([^"]*)"$/);
      if (quotedMatch) {
        try {
          const decoded = base64ToString(quotedMatch[1]);
          const data = JSON.parse(decoded);
          return {
            content: data.c || "",
            tags: (data.t || []).map((t: { i: string; n: string; o: string }) => ({
              id: t.i,
              name: t.n,
              color: t.o,
            })),
            todos: (data.td || []).map((td: { i: string; x: string; m: boolean; t: number }) => ({
              id: td.i,
              text: td.x,
              completed: td.m,
              createdAt: td.t,
            })),
            createdAt: data.ct || Date.now(),
            updatedAt: data.ut || Date.now(),
          };
        } catch {
          return null;
        }
      }
    }
  }

  if (formula.startsWith(NOTE_FORMULA_PREFIX) && formula.endsWith(NOTE_FORMULA_SUFFIX)) {
    const inner = formula.slice(NOTE_FORMULA_PREFIX.length, -NOTE_FORMULA_SUFFIX.length);
    const quotedMatch = inner.match(/^"([^"]*)"$/);
    if (quotedMatch) {
      try {
        const decoded = base64ToString(quotedMatch[1]);
        const data = JSON.parse(decoded);
        return {
          content: data.c || "",
          tags: (data.t || []).map((t: { i: string; n: string; o: string }) => ({
            id: t.i,
            name: t.n,
            color: t.o,
          })),
          todos: (data.td || []).map((td: { i: string; x: string; m: boolean; t: number }) => ({
            id: td.i,
            text: td.x,
            completed: td.m,
            createdAt: td.t,
          })),
          createdAt: data.ct || Date.now(),
          updatedAt: data.ut || Date.now(),
        };
      } catch {
        return null;
      }
    }
  }

  return null;
};

export const isNoteFormula = (value: string): boolean => {
  if (!value || !value.startsWith("=")) return false;

  for (const template of FORMULA_TEMPLATES) {
    if (value.startsWith(template.prefix) && value.endsWith(template.middle)) {
      const content = value.slice(template.prefix.length, -template.middle.length);
      if (/^"[A-Za-z0-9+/=]+"$/.test(content)) {
        return true;
      }
    }
  }

  if (value.startsWith(NOTE_FORMULA_PREFIX) && value.endsWith(NOTE_FORMULA_SUFFIX)) {
    return true;
  }

  return false;
};

export const getNoteCellKey = (row: number, col: string): string => `${col}${row}`;

export const createEmptyNote = (): CellNote => ({
  content: "",
  tags: [],
  todos: [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

export const createTag = (name: string, color: string): NoteTag => ({
  id: `tag_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
  name,
  color,
});

export const createTodo = (text: string): TodoItem => ({
  id: `todo_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
  text,
  completed: false,
  createdAt: Date.now(),
});

export const DEFAULT_TAG_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E9",
];

export const PRESET_TAGS: NoteTag[] = [
  { id: "tag_important", name: "重要", color: "#FF6B6B" },
  { id: "tag_todo", name: "待办", color: "#45B7D1" },
  { id: "tag_idea", name: "想法", color: "#96CEB4" },
  { id: "tag_review", name: "待审核", color: "#FFEAA7" },
  { id: "tag_urgent", name: "紧急", color: "#E74C3C" },
];
