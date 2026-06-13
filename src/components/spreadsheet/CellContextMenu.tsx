import { RefObject } from "react";

interface CellContextMenuProps {
  x: number;
  y: number;
  menuRef: RefObject<HTMLDivElement | null>;
  onOpenNote: () => void;
  onClose: () => void;
}

export default function CellContextMenu({ x, y, menuRef, onOpenNote, onClose }: CellContextMenuProps) {
  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white border border-gray-300 rounded-md shadow-lg py-1 min-w-[160px]"
      style={{ left: x, top: y }}
    >
      <button
        onClick={onOpenNote}
        className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
      >
        <span className="text-excel-green">📝</span>
        添加/编辑笔记
      </button>
      <div className="border-t border-gray-200 my-1" />
      <button
        onClick={onClose}
        className="w-full px-3 py-2 text-left text-sm text-gray-500 hover:bg-gray-100"
      >
        取消
      </button>
    </div>
  );
}
