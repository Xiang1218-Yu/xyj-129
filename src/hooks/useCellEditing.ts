import { useState, useRef, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { getCellKey } from "@/lib/spreadsheetUtils";

export function useCellEditing() {
  const { cellValues, setCellValue, setFormulaBarValue } = useAppStore();

  const [editingCell, setEditingCell] = useState<{ row: number; col: string } | null>(null);
  const [editValue, setEditValue] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

  const finishEditing = (save = true) => {
    if (editingCell && save) {
      setCellValue(editingCell.row, editingCell.col, editValue);
      setFormulaBarValue(editValue);
    }
    setEditingCell(null);
  };

  const handleCellClick = (row: number, col: string) => {
    if (editingCell) {
      if (editingCell.row === row && editingCell.col === col) return;
      setCellValue(editingCell.row, editingCell.col, editValue);
    }
    const val = cellValues[getCellKey(row, col)] || "";
    setFormulaBarValue(val);
    setEditingCell({ row, col });
    setEditValue(val);
  };

  useEffect(() => {
    if (editingCell && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingCell]);

  return {
    editingCell,
    editValue,
    setEditValue,
    editInputRef,
    finishEditing,
    handleCellClick,
  };
}
