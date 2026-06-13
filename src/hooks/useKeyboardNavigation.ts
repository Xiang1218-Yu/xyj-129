import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { COL_COUNT, ROW_COUNT, generateColLabels, getCellKey } from "@/lib/spreadsheetUtils";

interface UseKeyboardNavigationParams {
  editingCell: { row: number; col: string } | null;
  editValue: string;
  finishEditing: (save?: boolean) => void;
}

export function useKeyboardNavigation({
  editingCell,
  editValue,
  finishEditing,
}: UseKeyboardNavigationParams) {
  const { selectedCell, setSelectedCell, setFormulaBarValue, cellValues } = useAppStore();
  const colLabels = generateColLabels(COL_COUNT);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!editingCell || !selectedCell) return;
      if (e.key === "Enter") {
        e.preventDefault();
        finishEditing(true);
        const nextRow = Math.min(ROW_COUNT, selectedCell.row + 1);
        setSelectedCell({ row: nextRow, col: selectedCell.col });
        setFormulaBarValue(cellValues[getCellKey(nextRow, selectedCell.col)] || "");
      } else if (e.key === "Escape") {
        e.preventDefault();
        finishEditing(false);
      } else if (e.key === "Tab") {
        e.preventDefault();
        finishEditing(true);
        const currIdx = colLabels.indexOf(selectedCell.col);
        const nextCol = colLabels[Math.min(COL_COUNT - 1, currIdx + 1)];
        setSelectedCell({ row: selectedCell.row, col: nextCol });
        setFormulaBarValue(cellValues[getCellKey(selectedCell.row, nextCol)] || "");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editingCell, selectedCell, editValue, cellValues, finishEditing, setSelectedCell, setFormulaBarValue, colLabels]);
}
