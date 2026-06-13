import { useState, useRef, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import HelpPanel from "@/components/HelpPanel";
import NewsList from "@/components/NewsList";
import CamouflageMode from "@/components/CamouflageMode";
import NewsDetail from "@/components/NewsDetail";

export default function Spreadsheet() {
  const {
    activeSheet,
    isCamouflageMode,
    selectedCell,
    setSelectedCell,
    cellValues,
    setCellValue,
    setFormulaBarValue,
  } = useAppStore();

  const [editingCell, setEditingCell] = useState<{ row: number; col: string } | null>(null);
  const [editValue, setEditValue] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

  const colCount = 20;
  const rowCount = 80;

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

  const handleCellClick = (row: number, col: string) => {
    if (editingCell) {
      if (editingCell.row === row && editingCell.col === col) return;
      setCellValue(editingCell.row, editingCell.col, editValue);
    }
    const val = cellValues[getCellKey(row, col)] || "";
    setSelectedCell({ row, col });
    setFormulaBarValue(val);
    setEditingCell({ row, col });
    setEditValue(val);
  };

  const handleCellDoubleClick = (row: number, col: string) => {
    handleCellClick(row, col);
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
      if (!editingCell || !selectedCell) return;
      if (e.key === "Enter") {
        e.preventDefault();
        finishEditing(true);
        const nextRow = Math.min(rowCount, selectedCell.row + 1);
        setSelectedCell({ row: nextRow, col: selectedCell.col });
        setFormulaBarValue(cellValues[getCellKey(nextRow, selectedCell.col)] || "");
      } else if (e.key === "Escape") {
        e.preventDefault();
        finishEditing(false);
      } else if (e.key === "Tab") {
        e.preventDefault();
        finishEditing(true);
        const currIdx = colLabels.indexOf(selectedCell.col);
        const nextCol = colLabels[Math.min(colCount - 1, currIdx + 1)];
        setSelectedCell({ row: selectedCell.row, col: nextCol });
        setFormulaBarValue(cellValues[getCellKey(selectedCell.row, nextCol)] || "");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editingCell, selectedCell, editValue, cellValues]);

  if (isCamouflageMode) {
    return (
      <div className="flex-1 overflow-hidden bg-white">
        <CamouflageMode />
        <NewsDetail />
      </div>
    );
  }

  const showHelp = activeSheet === "help";
  const helpEndCol = showHelp ? colLabels[colCount - 1] : "E";
  const newsStartCol = showHelp ? null : "F";

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-white">
      <div className="flex-1 flex overflow-hidden">
        <div className="flex flex-col w-[40px] flex-shrink-0 bg-[#F3F2F1] border-r border-gray-300 z-10 sticky left-0">
          <div className="h-[25px] min-h-[25px] border-b border-gray-300 border-r border-gray-300 flex items-center justify-center sticky top-0 z-20 bg-[#F3F2F1]">
            <svg width="10" height="10" viewBox="0 0 10 10" className="text-gray-400">
              <polygon points="0,10 10,0 10,10" fill="currentColor" />
            </svg>
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="flex flex-col">
              {Array.from({ length: rowCount }).map((_, idx) => {
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

        <div className="flex-1 flex flex-col overflow-hidden">
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

          <div className="flex-1 overflow-auto relative">
            <div className="relative" style={{ width: `${colCount * 130 + 200}px` }}>
              {Array.from({ length: rowCount }).map((_, rIdx) => {
                const rowNum = rIdx + 1;
                return (
                  <div key={rowNum} className="flex" style={{ height: "24px" }}>
                    {colLabels.map((col) => {
                      const cellKey = getCellKey(rowNum, col);
                      const isSelected =
                        selectedCell?.row === rowNum && selectedCell?.col === col;
                      const isEditing =
                        editingCell?.row === rowNum && editingCell?.col === col;
                      const value = cellValues[cellKey] || "";

                      const isHelpArea =
                        !showHelp &&
                        (col === "B" || col === "C" || col === "D" || col === "E") &&
                        rowNum >= 1 && rowNum <= 50;
                      const isNewsArea =
                        newsStartCol &&
                        colLabels.indexOf(col) >= colLabels.indexOf(newsStartCol) &&
                        rowNum >= 1 && rowNum <= 60;
                      const isFullHelpArea =
                        showHelp && rowNum >= 1 && rowNum <= 70;

                      const showOverlay =
                        isHelpArea || isNewsArea || isFullHelpArea;
                      const isOverlayCorner =
                        (isHelpArea && col === "B" && rowNum === 1) ||
                        (isNewsArea && col === newsStartCol && rowNum === 1) ||
                        (isFullHelpArea && col === "B" && rowNum === 1);

                      return (
                        <div
                          key={cellKey}
                          onClick={() => !showOverlay && handleCellClick(rowNum, col)}
                          onDoubleClick={() => !showOverlay && handleCellDoubleClick(rowNum, col)}
                          className={`w-[130px] min-w-[130px] h-[24px] border-r border-b border-gray-200 px-2 text-[13px] flex items-center overflow-hidden relative ${
                            isSelected && !showOverlay ? "cell-selected" : ""
                          } ${
                            !showOverlay ? "cursor-cell" : ""
                          }`}
                          style={
                            showOverlay
                              ? {
                                  borderColor: "transparent",
                                  background: "transparent",
                                  pointerEvents: "none",
                                }
                              : undefined
                          }
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
                            <span className="truncate whitespace-nowrap text-gray-800">
                              {value}
                            </span>
                          )}

                          {isOverlayCorner && (
                            <div
                              className="absolute inset-0 pointer-events-auto"
                              style={{
                                left: col === "B" ? 0 : 0,
                                top: 0,
                                width:
                                  isFullHelpArea
                                    ? `${colCount * 130}px`
                                    : isHelpArea
                                    ? `${4 * 130}px`
                                    : `${(colCount - colLabels.indexOf(newsStartCol!)) * 130}px`,
                                height: isFullHelpArea ? "1680px" : isHelpArea ? "1200px" : "1440px",
                                zIndex: 5,
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {(isHelpArea && col === "B" && rowNum === 1) ||
                              (isFullHelpArea && col === "B" && rowNum === 1) ? (
                                <div className="h-full w-full border-r border-gray-300 overflow-hidden bg-white">
                                  <HelpPanel />
                                </div>
                              ) : null}
                              {isNewsArea && col === newsStartCol && rowNum === 1 ? (
                                <div className="h-full w-full overflow-hidden bg-white">
                                  <NewsList />
                                </div>
                              ) : null}
                            </div>
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

      <NewsDetail />
    </div>
  );
}
