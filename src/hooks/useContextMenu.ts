import { useState, useRef, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

export function useContextMenu() {
  const { openNotePanel } = useAppStore();

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    row: number;
    col: string;
  } | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  const handleCellContextMenu = (e: React.MouseEvent, row: number, col: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, row, col });
  };

  const handleOpenNote = () => {
    if (contextMenu) {
      openNotePanel(contextMenu.row, contextMenu.col);
      setContextMenu(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
        setContextMenu(null);
      }
    };
    if (contextMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [contextMenu]);

  return {
    contextMenu,
    setContextMenu,
    contextMenuRef,
    handleCellContextMenu,
    handleOpenNote,
  };
}
