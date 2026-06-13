import { RefObject } from "react";
import { useAppStore } from "@/store/useAppStore";
import HelpPanel from "@/components/HelpPanel";
import NewsList from "@/components/NewsList";
import OfficeAssistant from "@/components/OfficeAssistant";
import { CellNote } from "@/types";

interface CellNoteIndicatorProps {
  hasNote: boolean;
  pendingTodos: number;
  noteData: CellNote | null;
}

function CellNoteIndicator({ hasNote, pendingTodos, noteData }: CellNoteIndicatorProps) {
  if (!hasNote) return null;

  return (
    <>
      <div className="absolute top-0 right-0 w-0 h-0 border-t-[6px] border-r-[6px] border-t-transparent border-r-red-500" />
      {noteData?.tags && noteData.tags.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-[3px] flex">
          {noteData.tags.slice(0, 5).map((tag) => (
            <div
              key={tag.id}
              className="flex-1 h-full"
              style={{ backgroundColor: tag.color }}
            />
          ))}
        </div>
      )}
      {pendingTodos > 0 && (
        <div className="absolute top-0.5 left-0.5 bg-excel-green text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
          {pendingTodos > 9 ? "9+" : pendingTodos}
        </div>
      )}
    </>
  );
}

interface OverlayAnchorProps {
  type: "help" | "office" | "news" | null;
  width: number;
  height: number;
}

function OverlayAnchor({ type, width, height }: OverlayAnchorProps) {
  if (!type) return null;

  return (
    <div
      className="absolute inset-0 pointer-events-auto"
      style={{ left: 0, top: 0, width, height, zIndex: 5 }}
      onClick={(e) => e.stopPropagation()}
    >
      {type === "help" && (
        <div className="h-full w-full border-r border-gray-300 bg-white">
          <HelpPanel />
        </div>
      )}
      {type === "office" && (
        <div className="h-full w-full border-r border-gray-300 bg-white">
          <OfficeAssistant />
        </div>
      )}
      {type === "news" && (
        <div className="h-full w-full bg-white">
          <NewsList />
        </div>
      )}
    </div>
  );
}

export interface SpreadsheetCellProps {
  row: number;
  col: string;
  isOverlay: boolean;
  isOverlayAnchor: boolean;
  overlayAnchorType: "help" | "office" | "news" | null;
  overlayWidth: number;
  overlayHeight: number;
  isSelected: boolean;
  isEditing: boolean;
  value: string;
  editValue: string;
  editInputRef: RefObject<HTMLInputElement | null>;
  onCellClick: () => void;
  onCellContextMenu: (e: React.MouseEvent) => void;
  onEditValueChange: (value: string) => void;
  onFinishEditing: (save: boolean) => void;
}

export default function SpreadsheetCell({
  row,
  col,
  isOverlay,
  isOverlayAnchor,
  overlayAnchorType,
  overlayWidth,
  overlayHeight,
  isSelected,
  isEditing,
  value,
  editValue,
  editInputRef,
  onCellClick,
  onCellContextMenu,
  onEditValueChange,
  onFinishEditing,
}: SpreadsheetCellProps) {
  const { hasCellNote, getCellNote, getPendingTodosCount } = useAppStore();

  const hasNote = !isOverlay && hasCellNote(row, col);
  const pendingTodos = !isOverlay ? getPendingTodosCount(row, col) : 0;
  const noteData = !isOverlay ? getCellNote(row, col) : null;

  return (
    <div
      onClick={() => !isOverlay && onCellClick()}
      onDoubleClick={() => !isOverlay && onCellClick()}
      onContextMenu={(e) => !isOverlay && onCellContextMenu(e)}
      className={`w-[130px] min-w-[130px] h-[24px] border-r border-b border-gray-200 px-2 text-[13px] flex items-center ${
        isOverlayAnchor ? "overflow-visible" : "overflow-hidden"
      } relative ${isSelected && !isOverlay ? "cell-selected" : ""} ${
        !isOverlay ? "cursor-cell" : ""
      }`}
      style={
        isOverlay
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
          onChange={(e) => onEditValueChange(e.target.value)}
          onBlur={() => onFinishEditing(true)}
          className="w-full h-full bg-white outline-none text-[13px] px-1 border border-blue-500"
        />
      ) : (
        <span className="truncate whitespace-nowrap text-gray-800">
          {value}
        </span>
      )}

      <CellNoteIndicator hasNote={hasNote} pendingTodos={pendingTodos} noteData={noteData} />

      {isOverlayAnchor && (
        <OverlayAnchor type={overlayAnchorType} width={overlayWidth} height={overlayHeight} />
      )}
    </div>
  );
}
