import { useState, useRef, useEffect } from "react";
import { camouflageData, camouflageFormulaRows } from "@/data/camouflageData";
import { useAppStore } from "@/store/useAppStore";

export default function CamouflageMode() {
  const { cellValues, setCellValue, setFormulaBarValue, setSelectedCell, selectedCell } =
    useAppStore();

  const [editingCell, setEditingCell] = useState<{ row: number; col: string } | null>(null);
  const [editValue, setEditValue] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

  const allData = [...camouflageData, ...camouflageFormulaRows];
  const totalRows = Math.max(allData.length + 60, 120);
  const colCount = 12;

  const generateColLabels = (count: number): string[] => {
    const labels: string[] = [];
    for (let i = 0; i < count; i++) {
      let col = "";
      let n = i;
      while (n >= 0) {
        col = String.fromCharCode(65 + (n % 26)) + col;
        n = Math.floor(n / 26) - 1;
      }
      labels.push(col);
    }
    return labels;
  };

  const colLabels = generateColLabels(colCount);

  const getCellKey = (row: number, col: string) => `${col}${row}`;

  const getPresetValue = (rowIdx: number, col: string): string => {
    if (rowIdx < allData.length) {
      return String(allData[rowIdx][col] ?? "");
    }
    return "";
  };

  const getEffectiveValue = (rowIdx: number, col: string): string => {
    const key = getCellKey(rowIdx + 1, col);
    if (cellValues[key] !== undefined) return cellValues[key];
    return getPresetValue(rowIdx, col);
  };

  const handleCellClick = (rowIdx: number, col: string) => {
    const rowNum = rowIdx + 1;
    if (editingCell) {
      if (editingCell.row === rowNum && editingCell.col === col) return;
      setCellValue(editingCell.row, editingCell.col, editValue);
      setEditingCell(null);
    }
    setSelectedCell({ row: rowNum, col });
    const val = getEffectiveValue(rowIdx, col);
    setFormulaBarValue(val);
    setEditingCell({ row: rowNum, col });
    setEditValue(val);
  };

  const finishEditing = (save = true) => {
    if (editingCell && save) {
      setCellValue(editingCell.row, editingCell.col, editValue);
      setFormulaBarValue(editValue);
    }
    setEditingCell(null);
  };

  useEffect(() => {
    if (editingCell && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingCell]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!editingCell) return;
      const rowIdx = editingCell.row - 1;
      if (e.key === "Enter") {
        e.preventDefault();
        finishEditing(true);
        const nextRow = Math.min(totalRows - 1, rowIdx + 1);
        const col = editingCell.col;
        const val = getEffectiveValue(nextRow, col);
        setSelectedCell({ row: nextRow + 1, col });
        setFormulaBarValue(val);
        setEditingCell({ row: nextRow + 1, col });
        setEditValue(val);
      } else if (e.key === "Escape") {
        e.preventDefault();
        finishEditing(false);
      } else if (e.key === "Tab") {
        e.preventDefault();
        finishEditing(true);
        const currIdx = colLabels.indexOf(editingCell.col);
        const nextCol = colLabels[Math.min(colCount - 1, currIdx + 1)];
        const val = getEffectiveValue(rowIdx, nextCol);
        setSelectedCell({ row: rowIdx + 1, col: nextCol });
        setFormulaBarValue(val);
        setEditingCell({ row: rowIdx + 1, col: nextCol });
        setEditValue(val);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editingCell, editValue]);

  return (
    <div className="h-full w-full overflow-auto no-transition bg-white flex">
      <div className="flex flex-col w-[40px] flex-shrink-0 bg-[#F3F2F1] border-r border-gray-300 z-10 sticky left-0">
        <div className="h-[25px] min-h-[25px] border-b border-gray-300 border-r border-gray-300 flex items-center justify-center sticky top-0 z-20 bg-[#F3F2F1]">
          <svg width="10" height="10" viewBox="0 0 10 10" className="text-gray-400">
            <polygon points="0,10 10,0 10,10" fill="currentColor" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="flex flex-col">
            {Array.from({ length: totalRows }).map((_, idx) => {
              const rowNum = idx + 1;
              return (
                <div
                  key={rowNum}
                  onClick={() =>
                    setSelectedCell({
                      row: rowNum,
                      col: selectedCell?.col || "A",
                    })
                  }
                  className={`h-[24px] min-h-[24px] flex items-center justify-center text-[11px] border-b border-gray-300 flex-shrink-0 cursor-default ${
                    selectedCell?.row === rowNum
                      ? "bg-excel-green text-white font-semibold"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {rowNum}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <div className="h-[25px] min-h-[25px] bg-[#F3F2F1] flex border-b border-gray-300 flex-shrink-0 sticky top-0 z-10">
          {colLabels.map((col) => (
            <div
              key={col}
              onClick={() =>
                setSelectedCell({
                  row: selectedCell?.row || 1,
                  col,
                })
              }
              className={`w-[130px] min-w-[130px] border-r border-gray-300 flex items-center justify-center text-[12px] cursor-default ${
                selectedCell?.col === col
                  ? "bg-excel-green text-white font-semibold"
                  : "text-gray-700 font-medium hover:bg-gray-200"
              }`}
            >
              {col}
            </div>
          ))}
          <div className="flex-1 border-r border-gray-300" />
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="relative" style={{ width: `${colCount * 130 + 200}px` }}>
            {Array.from({ length: totalRows }).map((_, rIdx) => {
              const rowNum = rIdx + 1;

              let rowBg = "";
              if (rIdx === 0) rowBg = "bg-excel-greenLight/30";
              else if (rIdx === 1) rowBg = "bg-gray-50";
              else if (rIdx === allData.length - 1) rowBg = "bg-excel-greenLight/40";

              return (
                <div key={rowNum} className={`flex ${rowBg}`} style={{ height: "24px" }}>
                  {colLabels.map((col) => {
                    const cellKey = getCellKey(rowNum, col);
                    const isSelected =
                      selectedCell?.row === rowNum && selectedCell?.col === col;
                    const isEditing =
                      editingCell?.row === rowNum && editingCell?.col === col;
                    const value = getEffectiveValue(rIdx, col);

                    const isNumber =
                      typeof value === "string" &&
                      (value.startsWith("¥") || value.endsWith("%"));

                    const isTitleRow = rIdx === 0 && col === "A";
                    const isGrowth =
                      col === "H" && rIdx >= 2 && rIdx < allData.length - 2 && value;

                    return (
                      <div
                        key={cellKey}
                        onClick={() => handleCellClick(rIdx, col)}
                        onDoubleClick={() => handleCellClick(rIdx, col)}
                        className={`w-[130px] min-w-[130px] h-[24px] border-r border-b border-gray-200 px-2 text-[13px] flex items-center overflow-hidden relative ${
                          isSelected ? "cell-selected" : ""
                        } ${isNumber ? "justify-end" : "justify-start"}`}
                      >
                        {isEditing ? (
                          <input
                            ref={editInputRef}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={() => finishEditing(true)}
                            className="w-full h-full bg-white outline-none text-[13px] px-1 border border-blue-500"
                          />
                        ) : (
                          <span
                            className={`truncate whitespace-nowrap ${
                              isTitleRow
                                ? "text-[15px] font-bold text-excel-green text-center w-full"
                                : isGrowth
                                ? "text-green-600"
                                : rIdx === 1
                                ? "font-semibold text-gray-800"
                                : rIdx === allData.length - 1
                                ? "font-semibold text-gray-800"
                                : "text-gray-800"
                            }`}
                          >
                            {value}
                          </span>
                        )}
                      </div>
                    );
                  })}
                  <div className="flex-1 h-full border-b border-gray-200" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
