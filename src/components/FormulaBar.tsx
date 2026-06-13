import { useAppStore } from "@/store/useAppStore";
import { isNoteFormula } from "@/lib/noteCodec";
import { StickyNote } from "lucide-react";

export default function FormulaBar() {
  const { selectedCell, formulaBarValue, setFormulaBarValue, openNotePanel } = useAppStore();

  const cellRef = selectedCell
    ? `${selectedCell.col}${selectedCell.row}`
    : "A1";

  const hasNote = isNoteFormula(formulaBarValue);

  const handleOpenNote = () => {
    if (selectedCell) {
      openNotePanel(selectedCell.row, selectedCell.col);
    }
  };

  return (
    <div className="flex items-center h-[24px] border-b border-gray-300 bg-white no-select" style={{ height: "24px" }}>
      <div className="flex items-center w-[120px] min-w-[120px] h-full border-r border-gray-300 px-2 text-[13px] justify-center bg-gray-50">
        <span className="font-medium">{cellRef}</span>
      </div>
      <div className="flex items-center px-2 h-full w-[28px] min-w-[28px] border-r border-gray-100 text-excel-green font-bold text-center text-[14px] justify-center italic">
        fx
      </div>
      <div className="flex-1 h-full flex items-center relative">
        <input
          className="formula-input"
          value={formulaBarValue}
          onChange={(e) => setFormulaBarValue(e.target.value)}
          placeholder="输入内容或公式..."
        />
        {hasNote && (
          <button
            onClick={handleOpenNote}
            className="absolute right-2 p-1 text-excel-green hover:text-excel-greenDark transition-colors"
            title="编辑笔记"
          >
            <StickyNote className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
