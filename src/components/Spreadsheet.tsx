import { useAppStore } from "@/store/useAppStore";
import CamouflageMode from "@/components/CamouflageMode";
import NewsDetail from "@/components/NewsDetail";
import NotePanel from "@/components/NotePanel";
import SpreadsheetRowHeader from "@/components/spreadsheet/SpreadsheetRowHeader";
import SpreadsheetColHeader from "@/components/spreadsheet/SpreadsheetColHeader";
import SpreadsheetCell from "@/components/spreadsheet/SpreadsheetCell";
import CellContextMenu from "@/components/spreadsheet/CellContextMenu";
import { useCellEditing } from "@/hooks/useCellEditing";
import { useContextMenu } from "@/hooks/useContextMenu";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";
import {
  COL_COUNT,
  ROW_COUNT,
  CELL_WIDTH,
  generateColLabels,
  getCellKey,
} from "@/lib/spreadsheetUtils";

type OverlayAnchorType = "help" | "office" | "news" | null;

interface OverlayInfo {
  isOverlay: boolean;
  isOverlayAnchor: boolean;
  anchorType: OverlayAnchorType;
  overlayWidth: number;
  overlayHeight: number;
}

function getOverlayInfo(
  row: number,
  col: string,
  showFullPanel: boolean,
  showOffice: boolean,
  newsStartCol: string | null,
  colLabels: string[]
): OverlayInfo {
  const empty: OverlayInfo = {
    isOverlay: false,
    isOverlayAnchor: false,
    anchorType: null,
    overlayWidth: 0,
    overlayHeight: 0,
  };

  if (showFullPanel) {
    if (row < 1 || row > 70) return empty;
    const isAnchor = col === "B" && row === 1;
    return {
      isOverlay: true,
      isOverlayAnchor: isAnchor,
      anchorType: isAnchor ? (showOffice ? "office" : "help") : null,
      overlayWidth: COL_COUNT * CELL_WIDTH,
      overlayHeight: 1680,
    };
  }

  const isHelpCol = col === "B" || col === "C" || col === "D" || col === "E";
  if (isHelpCol && row >= 1 && row <= 50) {
    const isAnchor = col === "B" && row === 1;
    return {
      isOverlay: true,
      isOverlayAnchor: isAnchor,
      anchorType: isAnchor ? "help" : null,
      overlayWidth: 4 * CELL_WIDTH,
      overlayHeight: 1200,
    };
  }

  if (newsStartCol) {
    const colIdx = colLabels.indexOf(col);
    const newsStartIdx = colLabels.indexOf(newsStartCol);
    if (colIdx >= newsStartIdx && row >= 1 && row <= 60) {
      const isAnchor = col === newsStartCol && row === 1;
      return {
        isOverlay: true,
        isOverlayAnchor: isAnchor,
        anchorType: isAnchor ? "news" : null,
        overlayWidth: (COL_COUNT - newsStartIdx) * CELL_WIDTH,
        overlayHeight: 1440,
      };
    }
  }

  return empty;
}

export default function Spreadsheet() {
  const { activeSheet, isCamouflageMode, selectedCell, cellValues } =
    useAppStore();

  const { editingCell, editValue, setEditValue, editInputRef, finishEditing, handleCellClick } =
    useCellEditing();

  const { contextMenu, setContextMenu, contextMenuRef, handleCellContextMenu, handleOpenNote } =
    useContextMenu();

  useKeyboardNavigation({
    editingCell,
    editValue,
    finishEditing,
  });

  if (isCamouflageMode) {
    return (
      <div className="flex-1 overflow-hidden flex flex-col bg-white">
        <CamouflageMode />
      </div>
    );
  }

  const showHelp = activeSheet === "help";
  const showOffice = activeSheet === "office";
  const showFullPanel = showHelp || showOffice;
  const newsStartCol = showFullPanel ? null : "F";
  const colLabels = generateColLabels(COL_COUNT);

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-white">
      <div className="flex-1 flex overflow-hidden">
        <SpreadsheetRowHeader />

        <div className="flex-1 flex flex-col overflow-hidden">
          <SpreadsheetColHeader />

          <div className="flex-1 overflow-auto relative">
            <div className="relative" style={{ width: `${COL_COUNT * CELL_WIDTH + 200}px` }}>
              {Array.from({ length: ROW_COUNT }).map((_, rIdx) => {
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
                      const overlay = getOverlayInfo(rowNum, col, showFullPanel, showOffice, newsStartCol, colLabels);

                      return (
                        <SpreadsheetCell
                          key={cellKey}
                          row={rowNum}
                          col={col}
                          isOverlay={overlay.isOverlay}
                          isOverlayAnchor={overlay.isOverlayAnchor}
                          overlayAnchorType={overlay.anchorType}
                          overlayWidth={overlay.overlayWidth}
                          overlayHeight={overlay.overlayHeight}
                          isSelected={isSelected}
                          isEditing={isEditing}
                          value={value}
                          editValue={editValue}
                          editInputRef={editInputRef}
                          onCellClick={() => handleCellClick(rowNum, col)}
                          onCellContextMenu={(e) => handleCellContextMenu(e, rowNum, col)}
                          onEditValueChange={setEditValue}
                          onFinishEditing={finishEditing}
                        />
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

      {contextMenu && (
        <CellContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          menuRef={contextMenuRef}
          onOpenNote={handleOpenNote}
          onClose={() => setContextMenu(null)}
        />
      )}

      <NotePanel />
    </div>
  );
}
